# Changelog

## 1.4.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.3.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.2.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint

## [0.3.0] - 2026-11-08

### Added
- File manager API endpoints:
  - `GET /api/files` — List workspace files as tree
  - `GET /api/files/content?path=<path>` — Read file content
  - `POST /api/files/content` — Write file content
  - `DELETE /api/files` — Delete file or directory
  - `POST /api/files/mkdir` — Create directory
- Frontend file manager component (`FileManager.jsx`) with:
  - Tree view navigation with expand/collapse
  - File create, read, edit, delete operations
  - Directory create/delete operations
  - In-browser text editor with save
- Workspace persistence via Docker volume (`workspace-data`)
- Configurable workspace root via `WORKSPACE_ROOT` environment variable

### Infrastructure
- Backend: Added `pathlib`, `shutil` stdlib modules
- Frontend: No new dependencies
- Docker Compose: Added `workspace-data` volume for persistence

## [0.2.0] - 2026-11-01

### Added
- Code execution sandbox API (`POST /api/execute`)
- Python execution support via python3
- JavaScript execution support via node
- Configurable execution timeout with enforcement
- Returns stdout, stderr, and exit code

### Infrastructure
- No new dependencies; uses stdlib subprocess

## [0.1.0] - 2026-10-26

### Added
- FastAPI backend with health (`/api/health`) and version (`/api/version`) endpoints
- React + Vite frontend with backend health display
- Docker Compose orchestration for backend and frontend
- CORS configuration for local development
- Initial project structure and documentation

### Infrastructure
- Backend: Python 3.12, FastAPI 0.115, Uvicorn 0.32
- Frontend: React 18, Vite 8
- Container: Docker, docker-compose
