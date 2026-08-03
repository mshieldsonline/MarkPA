import { useState } from 'react'

const BLANK = { text: '', priority: 'med', due_date: '', project_id: '' }

export default function Tasks({ tasks, projects, createTask, updateTask, deleteTask }) {
  const [filter, setFilter] = useState('open')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const filtered = tasks.filter(t => {
    if (filter === 'open')  return !t.done
    if (filter === 'done')  return t.done
    if (filter === 'high')  return !t.done && t.priority === 'high'
    if (filter === 'today') return !t.done && t.due_date === today
    return true
  })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.text.trim()) return
    setSaving(true)
    await createTask({ text: form.text, priority: form.priority, due_date: form.due_date || null, project_id: form.project_id || null })
    setForm(BLANK)
    setShowForm(false)
    setSaving(false)
  }

  const FILTERS = ['open', 'high', 'today', 'done', 'all']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cce8f4' }}>Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <i className="ti ti-plus" />Add task
        </button>
      </div>

      {showForm && (
        <form className="card" style={{ marginBottom: 16 }} onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 150px 160px', gap: 10, marginBottom: 10 }}>
            <input
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              placeholder="Task description…"
              autoFocus
            />
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="high">High</option>
              <option value="med">Med</option>
              <option value="low">Low</option>
            </select>
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
            />
            <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '5px 12px', fontSize: 11 }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '28px 18px', color: 'var(--txt2)', textAlign: 'center', fontSize: 13 }}>
            No tasks here
          </div>
        )}
        {filtered.map((task, i) => (
          <TaskRow
            key={task.id}
            task={task}
            projects={projects}
            today={today}
            onToggle={() => updateTask(task.id, { done: !task.done })}
            onDelete={() => deleteTask(task.id)}
            hasBorder={i < filtered.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function TaskRow({ task, projects, today, onToggle, onDelete, hasBorder }) {
  const project = projects.find(p => p.id === task.project_id)
  const overdue  = !task.done && task.due_date && task.due_date < today

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
      borderBottom: hasBorder ? '1px solid var(--brd)' : 'none',
      opacity: task.done ? .5 : 1,
    }}>
      <input
        type="checkbox"
        checked={!!task.done}
        onChange={onToggle}
        style={{ flexShrink: 0 }}
      />
      <div className={`dot dot-${task.done ? 'done' : task.priority}`} />
      <span style={{
        flex: 1, fontSize: 13,
        color: task.done ? 'var(--txt2)' : 'var(--txt)',
        textDecoration: task.done ? 'line-through' : 'none',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {task.text}
      </span>
      {project && <span className="tag">{project.name}</span>}
      {task.due_date && (
        <span style={{ fontSize: 11, color: overdue ? 'var(--high)' : 'var(--txt2)', flexShrink: 0 }}>
          {overdue && <i className="ti ti-alert-triangle" style={{ marginRight: 3, fontSize: 10 }} />}
          {task.due_date}
        </span>
      )}
      <button
        className="btn btn-ghost"
        style={{ padding: '2px 8px', fontSize: 15, lineHeight: 1, flexShrink: 0, border: 'none', opacity: .5 }}
        onClick={onDelete}
        title="Delete"
      >×</button>
    </div>
  )
}
