from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI(title="prism-lab-145 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecuteRequest(BaseModel):
    code: str
    language: str
    timeout: int = 10


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


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


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "prism-lab-145"}


@app.get("/api/version")
async def version():
    return {"version": "0.1.0", "name": "prism-lab-145"}


@app.post("/api/execute", response_model=ExecuteResponse)
async def execute(request: ExecuteRequest):
    return execute_code(request.code, request.language, request.timeout)