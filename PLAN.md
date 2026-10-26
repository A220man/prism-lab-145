# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

project-init

## Roadmap

### project-init — Project initialization with FastAPI + React skeleton

Status: done

Acceptance:
- FastAPI backend runs on port 8000
- React frontend runs on port 3000
- Frontend can call backend health endpoint
- Both services start via single command

Implementation: `backend/app/main.py`, `backend/requirements.txt`, `backend/Dockerfile`, `frontend/src/App.jsx`, `frontend/package.json`, `frontend/Dockerfile`, `docker-compose.yml`

### code-execution — Code execution sandbox API

Status: planned

Acceptance:
- POST /api/execute accepts code and language
- Returns stdout, stderr, exit code
- Supports Python and JavaScript at minimum
- Execution timeout enforced

### file-manager — File manager for user workspaces

Status: planned

Acceptance:
- List, read, write, delete files in workspace
- Tree view in frontend
- Persists across sessions

### ai-assistant — AI coding assistant integration

Status: planned

Acceptance:
- Chat interface in frontend
- Backend proxies to LLM API
- Context includes open files

