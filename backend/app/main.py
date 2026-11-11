from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from pathlib import Path
import shutil

app = FastAPI(title="prism-lab-145 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
WORKSPACE_ROOT = Path(os.environ.get("WORKSPACE_ROOT", "/workspace"))
WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)


class ExecuteRequest(BaseModel):
    code: str
    language: str
    timeout: int = 10


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


class FileNode(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: int = 0
    children: list['FileNode'] = []


class FileContent(BaseModel):
    path: str
    content: str


class FileWriteRequest(BaseModel):
    path: str
    content: str


class FileDeleteRequest(BaseModel):
    path: str


class FileRenameRequest(BaseModel):
    old_path: str
    new_path: str



@app.post("/api/files/rename")
async def rename_file(request: FileRenameRequest):
    """Rename or move file or directory."""
    old_target = validate_path(request.old_path)
    new_target = validate_path(request.new_path)
    if not old_target.exists():
        raise HTTPException(status_code=404, detail="Source path not found")
    if new_target.exists():
        raise HTTPException(status_code=400, detail="Destination path already exists")
    new_target.parent.mkdir(parents=True, exist_ok=True)
    old_target.rename(new_target)
    return {"success": True, "old_path": request.old_path, "new_path": request.new_path}


SUPPORTED_LANGUAGES = {
    "python": {"command": ["python3", "-c"], "extension": ".py"},
    "javascript": {"command": ["node", "-e"], "extension": ".js"},
}


def execute_code(code: str, language: str, timeout: int) -> ExecuteResponse:
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {language}")

    lang_config = SUPPORTED_LANGUAGES[language]
    
    with tempfile.NamedTemporaryFile(mode='w', suffix=lang_config["extension"], delete=False) as f:
        f.write(code)
        temp_path = f.name

    try:
        cmd = lang_config["command"] + [code]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return ExecuteResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.returncode
        )
    except subprocess.TimeoutExpired:
        return ExecuteResponse(
            stdout="",
            stderr=f"Execution timed out after {timeout} seconds",
            exit_code=-1
        )
    except Exception as e:
        return ExecuteResponse(
            stdout="",
            stderr=str(e),
            exit_code=-1
        )
    finally:
        try:
            os.unlink(temp_path)
        except:
            pass


def validate_path(path: str) -> Path:
    """Resolve and validate path is within workspace."""
    try:
        resolved = (WORKSPACE_ROOT / path).resolve()
        if not str(resolved).startswith(str(WORKSPACE_ROOT.resolve())):
            raise HTTPException(status_code=400, detail="Path traversal not allowed")
        return resolved
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def build_tree(path: Path, relative_root: Path) -> FileNode:
    """Recursively build file tree."""
    try:
        rel_path = path.relative_to(relative_root)
    except ValueError:
        rel_path = Path(".")
    
    stat = path.stat()
    is_dir = path.is_dir()
    children = []
    
    if is_dir:
        try:
            for child in sorted(path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
                if not child.name.startswith('.'):
                    children.append(build_tree(child, relative_root))
        except PermissionError:
            pass
    
    return FileNode(
        name=path.name if path != relative_root else "workspace",
        path=str(rel_path) if path != relative_root else "",
        is_dir=is_dir,
        size=stat.st_size if not is_dir else 0,
        children=children
    )


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "prism-lab-145"}


@app.get("/api/version")
async def version():
    return {"version": "0.1.0", "name": "prism-lab-145"}


@app.post("/api/execute", response_model=ExecuteResponse)
async def execute(request: ExecuteRequest):
    return execute_code(request.code, request.language, request.timeout)


@app.get("/api/files", response_model=FileNode)
async def list_files(path: str = ""):
    """List files and directories in workspace."""
    target = validate_path(path)
    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")
    return build_tree(target, WORKSPACE_ROOT)


@app.get("/api/files/content", response_model=FileContent)
async def read_file(path: str):
    """Read file content."""
    target = validate_path(path)
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    try:
        content = target.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8 text")
    return FileContent(path=path, content=content)


@app.post("/api/files/content", response_model=FileContent)
async def write_file(request: FileWriteRequest):
    """Write file content."""
    target = validate_path(request.path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(request.content, encoding='utf-8')
    return FileContent(path=request.path, content=request.content)


@app.delete("/api/files")
async def delete_file(request: FileDeleteRequest):
    """Delete file or directory."""
    target = validate_path(request.path)
    if not target.exists():
        raise HTTPException(status_code=404, detail="Path not found")
    if target.is_dir():
        shutil.rmtree(target)
    else:
        target.unlink()
    return {"success": True, "path": request.path}


@app.post("/api/files/mkdir")
async def create_directory(request: FileDeleteRequest):
    """Create directory."""
    target = validate_path(request.path)
    target.mkdir(parents=True, exist_ok=True)
    return {"success": True, "path": request.path}
