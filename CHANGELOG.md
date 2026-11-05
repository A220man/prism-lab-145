# Changelog

## 1.2.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint
## [0.2.0] - 2026-11-01

### Added
- Code execution sandbox API (`POST /api/execute`)
- Python execution support via python3
- JavaScript execution support via node
- Configurable execution timeout with enforcement
- Returns stdout, stderr, and exit code

### Infrastructure
- No new dependencies; uses stdlib subprocess
Partial code published for continued development. Known issues: STATUS.md.

All notable changes to this project will be documented in this format.

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
