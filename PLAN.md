# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

file-manager

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

Status: done

Acceptance:
- POST /api/execute accepts code and language
- Returns stdout, stderr, exit code
- Supports Python and JavaScript at minimum
- Execution timeout enforced

Implementation: `backend/app/main.py`, `backend/requirements.txt`

### file-manager — File manager for user workspaces

Status: done

Acceptance:
- List, read, write, delete files in workspace
- Tree view in frontend
- Persists across sessions

Implementation: `backend/app/main.py`, `frontend/src/FileManager.jsx`, `frontend/src/App.jsx`, `docker-compose.yml`

### ai-assistant — AI coding assistant integration

Status: in_progress

Acceptance:
- Chat interface in frontend (AIChat.jsx component, integrated in App.jsx)
- Backend proxies to LLM API with context-aware response generation
- Context includes open files (context parameter now includes workspace file tree)

Implementation: `backend/app/main.py - ai_chat endpoint with context support`, `frontend/src/AIChat.jsx - chat component with send functionality`, `frontend/src/App.jsx - AI chat overlay integration`

Tests: `backend/test_ai_chat.py - targeted endpoint tests`

