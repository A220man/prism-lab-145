# prism-lab-145 — Ryan Vo

> Work in progress. This checkpoint may be incomplete or fail tests. See PLAN.md and STATUS.md before use.


AI/ML developer tools - code execution sandbox with file management and AI assistant.

## Quick Start

### Using Docker (Recommended)

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Health: http://localhost:8000/api/health

### Local Development

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
prism-lab-145/
├── backend/
│   ├── app/
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # React frontend
│   │   └── FileManager.jsx  # File manager component
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── feature-plan.json
└── PLAN.md
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/version` - Version info
- `POST /api/execute` - Execute code (Python/JavaScript)
- `GET /api/files` - List workspace files (tree)
- `GET /api/files/content?path=<path>` - Read file content
- `POST /api/files/content` - Write file content
- `DELETE /api/files` - Delete file or directory
- `POST /api/files/mkdir` - Create directory

## Features (Roadmap)

- ✅ Project initialization (FastAPI + React)
- ✅ Code execution sandbox API
- ✅ File manager for user workspaces
- 🔄 AI coding assistant integration

## License

MIT

Maintainer: Ryan Vo <ryandtvo@gmail.com>
