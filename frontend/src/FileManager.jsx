import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'http://localhost:8000/api'

function FileTree({ node, onSelect, onCreateFile, onCreateDir, onDelete, expandedPaths, setExpandedPaths, selectedPath }) {
  const isExpanded = expandedPaths.has(node.path)
  const hasChildren = node.is_dir && node.children && node.children.length > 0
  const isSelected = selectedPath === node.path

  const toggleExpand = (e) => {
    e.stopPropagation()
    if (hasChildren) {
      setExpandedPaths(prev => {
        const next = new Set(prev)
        if (next.has(node.path)) {
          next.delete(node.path)
        } else {
          next.add(node.path)
        }
        return next
      })
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onSelect(node)
  }

  const handleCreateFile = (e) => {
    e.stopPropagation()
    if (node.is_dir) {
      onCreateFile(node.path)
    }
  }

  const handleCreateDir = (e) => {
    e.stopPropagation()
    if (node.is_dir) {
      onCreateDir(node.path)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(node.path, node.is_dir)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          background: isSelected ? '#e3f2fd' : 'transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={handleClick}
      >
        {hasChildren && (
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={toggleExpand}
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span style={{ width: '16px', display: 'inline-block' }} />}
        <span
          style={{
            marginLeft: '4px',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.name}
        </span>
        {node.is_dir && (
          <div style={{ display: 'flex', gap: '4px', opacity: 0.6 }}>
            <button onClick={handleCreateFile} title="New file" style={{ padding: '0 4px', fontSize: '12px' }}>+</button>
            <button onClick={handleCreateDir} title="New folder" style={{ padding: '0 4px', fontSize: '12px' }}>📁</button>
          </div>
        )}
        {!node.is_dir && (
          <span style={{ fontSize: '11px', color: '#666', marginRight: '8px' }}>
            {formatSize(node.size)}
          </span>
        )}
        <button
          onClick={handleDelete}
          title="Delete"
          style={{
            padding: '0 4px',
            fontSize: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#f44336',
            opacity: 0.7,
          }}
        >
          ×
        </button>
      </div>
      {isExpanded && hasChildren && (
        <div style={{ marginLeft: '20px', borderLeft: '1px solid #e0e0e0', paddingLeft: '8px' }}>
          {node.children.map(child => (
            <FileTree
              key={child.path}
              node={child}
              onSelect={onSelect}
              onCreateFile={onCreateFile}
              onCreateDir={onCreateDir}
              onDelete={onDelete}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function FileEditor({ filePath, content, onSave, onClose, onContentChange }) {
  const [localContent, setLocalContent] = useState(content || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLocalContent(content || '')
  }, [content])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/files/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content: localContent }),
      })
      onSave()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {filePath}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '6px 12px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
      <textarea
        value={localContent}
        onChange={(e) => {
          setLocalContent(e.target.value)
          onContentChange?.(e.target.value)
        }}
        style={{
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          padding: '12px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          background: '#fff',
          color: '#333',
        }}
        spellCheck={false}
      />
    </div>
  )
}

function WelcomeScreen() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📁</div>
      <h2 style={{ margin: '0 0 0.5rem' }}>No file selected</h2>
      <p>Select a file from the tree to view or edit it</p>
      <p style={{ fontSize: '13px', marginTop: '1rem' }}>Right-click folders to create files or directories</p>
    </div>
  )
}

export default function FileManager() {
  const [tree, setTree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [expandedPaths, setExpandedPaths] = useState(new Set(['']))
  const [creatingPath, setCreatingPath] = useState(null)
  const [createType, setCreateType] = useState(null) // 'file' or 'dir'
  const [newName, setNewName] = useState('')

  const fetchTree = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/files`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setTree(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTree()
  }, [fetchTree])

  const handleSelect = async (node) => {
    if (node.is_dir) return
    setSelectedFile(node)
    try {
      const res = await fetch(`${API_BASE}/files/content?path=${encodeURIComponent(node.path)}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setFileContent(data.content)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateFile = (parentPath) => {
    setCreatingPath(parentPath)
    setCreateType('file')
    setNewName('new-file.txt')
  }

  const handleCreateDir = (parentPath) => {
    setCreatingPath(parentPath)
    setCreateType('dir')
    setNewName('new-folder')
  }

  const handleDelete = async (path, isDir) => {
    if (!confirm(`Delete ${isDir ? 'folder' : 'file'} "${path}"?`)) return
    try {
      const res = await fetch(`${API_BASE}/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      if (!res.ok) throw new Error(await res.text())
      fetchTree()
      if (selectedFile?.path === path) {
        setSelectedFile(null)
        setFileContent('')
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const confirmCreate = async () => {
    if (!creatingPath || !newName.trim()) return
    const fullPath = creatingPath ? `${creatingPath}/${newName.trim()}` : newName.trim()
    try {
      if (createType === 'dir') {
        const res = await fetch(`${API_BASE}/files/mkdir`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: fullPath }),
        })
        if (!res.ok) throw new Error(await res.text())
      } else {
        const res = await fetch(`${API_BASE}/files/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: fullPath, content: '' }),
        })
        if (!res.ok) throw new Error(await res.text())
      }
      fetchTree()
      setCreatingPath(null)
      setCreateType(null)
      setNewName('')
    } catch (err) {
      alert('Failed to create: ' + err.message)
    }
  }

  const cancelCreate = () => {
    setCreatingPath(null)
    setCreateType(null)
    setNewName('')
  }

  const handleSave = async () => {
    if (!selectedFile) return
    try {
      const res = await fetch(`${API_BASE}/files/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile.path, content: fileContent }),
      })
      if (!res.ok) throw new Error(await res.text())
      fetchTree()
      alert('Saved successfully')
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 80px)',
      minHeight: '500px',
      fontFamily: 'system-ui',
    }}>
      {/* Sidebar - File Tree */}
      <div style={{
        width: '280px',
        borderRight: '1px solid #e0e0e0',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}>
        <div style={{
          padding: '12px',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 600,
          fontSize: '14px',
        }}>
          Workspace
        </div>
        <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
          {tree && <FileTree
            node={tree}
            onSelect={handleSelect}
            onCreateFile={handleCreateFile}
            onCreateDir={handleCreateDir}
            onDelete={handleDelete}
            expandedPaths={expandedPaths}
            setExpandedPaths={setExpandedPaths}
            selectedPath={selectedFile?.path}
          />}
        </div>
        <div style={{
          padding: '8px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={() => handleCreateFile('')}
            style={{ flex: 1, padding: '6px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            New File
          </button>
          <button
            onClick={() => handleCreateDir('')}
            style={{ flex: 1, padding: '6px', background: '#388e3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            New Folder
          </button>
        </div>
      </div>

      {/* Main - Editor or Welcome */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {creatingPath && (
          <div style={{
            padding: '12px',
            background: '#fff3e0',
            borderBottom: '1px solid #ffe0b2',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <select
              value={createType}
              onChange={(e) => setCreateType(e.target.value)}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="file">File</option>
              <option value="dir">Directory</option>
            </select>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={createType === 'dir' ? 'folder-name' : 'file-name.txt'}
              style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && confirmCreate()}
            />
            <button onClick={confirmCreate} style={{ padding: '6px 12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create</button>
            <button onClick={cancelCreate} style={{ padding: '6px 12px', background: 'none', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
        {selectedFile ? (
          <FileEditor
            filePath={selectedFile.path}
            content={fileContent}
            onSave={handleSave}
            onClose={() => setSelectedFile(null)}
            onContentChange={(c) => setFileContent(c)}
          />
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  )
}
