"""Targeted test for the AI chat endpoint."""
import json
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_ai_chat_hello():
    """Test AI chat with hello message."""
    response = client.post("/api/ai/chat", json={"message": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
    # Should contain greeting
    assert "hello" in data["response"].lower() or "hi" in data["response"].lower()


def test_ai_chat_file():
    """Test AI chat with file-related message."""
    response = client.post("/api/ai/chat", json={"message": "read a file"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_ai_chat_context():
    """Test AI chat with context provided."""
    response = client.post(
        "/api/ai/chat",
        json={"message": "what can you do", "context": "workspace files"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_ai_chat_execute():
    """Test AI chat with execute-related message."""
    response = client.post("/api/ai/chat", json={"message": "execute python code"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_ai_chat_list():
    """Test AI chat with list-related message."""
    response = client.post("/api/ai/chat", json={"message": "list files"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_ai_chat_unknown():
    """Test AI chat with unknown message."""
    response = client.post("/api/ai/chat", json={"message": "xyz random query"})
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
