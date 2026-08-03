import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './views/Dashboard'
import Tasks from './views/Tasks'
import Projects from './views/Projects'
import Goals from './views/Goals'
import Notes from './views/Notes'
import Captures from './views/Captures'
import './index.css'

const call = async (path, method = 'GET', body = null) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(path, opts)
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [goals, setGoals] = useState([])
  const [notes, setNotes] = useState([])
  const [captures, setCaptures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safe = (p) => p.then(d => Array.isArray(d) ? d : []).catch(() => [])
    Promise.all([
      safe(call('/api/tasks')),
      safe(call('/api/projects')),
      safe(call('/api/goals')),
      safe(call('/api/notes')),
      safe(call('/api/captures')),
    ]).then(([t, p, g, n, c]) => {
      setTasks(t); setProjects(p); setGoals(g); setNotes(n); setCaptures(c)
      setLoading(false)
    })
  }, [])

  const createTask = async (data) => {
    const task = await call('/api/tasks', 'POST', data)
    if (task) setTasks(prev => [task, ...prev])
    return task
  }
  const updateTask = async (id, data) => {
    const task = await call(`/api/tasks?id=${id}`, 'PATCH', data)
    if (task) setTasks(prev => prev.map(t => t.id === id ? task : t))
  }
  const deleteTask = async (id) => {
    await call(`/api/tasks?id=${id}`, 'DELETE')
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const createProject = async (data) => {
    const p = await call('/api/projects', 'POST', data)
    if (p) setProjects(prev => [p, ...prev])
  }
  const updateProject = async (id, data) => {
    const p = await call(`/api/projects?id=${id}`, 'PATCH', data)
    if (p) setProjects(prev => prev.map(x => x.id === id ? p : x))
  }
  const deleteProject = async (id) => {
    await call(`/api/projects?id=${id}`, 'DELETE')
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const createGoal = async (data) => {
    const g = await call('/api/goals', 'POST', data)
    if (g) setGoals(prev => [g, ...prev])
  }
  const updateGoal = async (id, data) => {
    const g = await call(`/api/goals?id=${id}`, 'PATCH', data)
    if (g) setGoals(prev => prev.map(x => x.id === id ? g : x))
  }
  const deleteGoal = async (id) => {
    await call(`/api/goals?id=${id}`, 'DELETE')
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const createNote = async (data) => {
    const n = await call('/api/notes', 'POST', data)
    if (n) setNotes(prev => [n, ...prev])
  }
  const updateNote = async (id, data) => {
    const n = await call(`/api/notes?id=${id}`, 'PATCH', data)
    if (n) setNotes(prev => prev.map(x => x.id === id ? n : x))
  }
  const deleteNote = async (id) => {
    await call(`/api/notes?id=${id}`, 'DELETE')
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const createCapture = async (text) => {
    const c = await call('/api/captures', 'POST', { text })
    if (c) setCaptures(prev => [c, ...prev])
  }
  const promoteCapture = async (id) => {
    const task = await call(`/api/captures?id=${id}&action=promote`, 'PATCH')
    setCaptures(prev => prev.filter(c => c.id !== id))
    if (task) setTasks(prev => [task, ...prev])
  }
  const deleteCapture = async (id) => {
    await call(`/api/captures?id=${id}`, 'DELETE')
    setCaptures(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, color: 'var(--txt2)' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <i className="ti ti-loader-2" style={{ fontSize: 30, color: 'var(--acc)', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 13 }}>Loading MarkPA…</span>
    </div>
  )

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} captureCount={captures.length} />
      <div className="main">
        <TopBar />
        <div className="content">
          {view === 'dashboard' && <Dashboard tasks={tasks} projects={projects} goals={goals} captures={captures} setView={setView} />}
          {view === 'tasks'     && <Tasks tasks={tasks} projects={projects} createTask={createTask} updateTask={updateTask} deleteTask={deleteTask} />}
          {view === 'projects'  && <Projects projects={projects} tasks={tasks} createProject={createProject} updateProject={updateProject} deleteProject={deleteProject} />}
          {view === 'goals'     && <Goals goals={goals} createGoal={createGoal} updateGoal={updateGoal} deleteGoal={deleteGoal} />}
          {view === 'notes'     && <Notes notes={notes} createNote={createNote} updateNote={updateNote} deleteNote={deleteNote} />}
          {view === 'captures'  && <Captures captures={captures} createCapture={createCapture} promoteCapture={promoteCapture} deleteCapture={deleteCapture} />}
        </div>
      </div>
    </div>
  )
}
