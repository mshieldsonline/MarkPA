import { useState } from 'react'

const BLANK = { name: '', description: '', status: 'active' }

export default function Projects({ projects, tasks, createProject, updateProject, deleteProject }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await createProject(form)
    setForm(BLANK)
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cce8f4' }}>Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <i className="ti ti-plus" />Add project
        </button>
      </div>

      {showForm && (
        <form className="card" style={{ marginBottom: 16 }} onSubmit={submit}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name…" autoFocus />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description / context (optional)…" rows={2} style={{ resize: 'none' }} />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: 160 }}>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On hold</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {projects.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--txt2)', fontSize: 13 }}>No projects yet</div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.project_id === project.id)
          const openCount    = projectTasks.filter(t => !t.done).length

          return (
            <div key={project.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: projectTasks.length > 0 ? 14 : 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#cce8f4' }}>{project.name}</span>
                    <span className={`badge badge-${project.status}`}>{project.status.replace('_', ' ')}</span>
                  </div>
                  {project.description && (
                    <p style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6 }}>{project.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <select
                    value={project.status}
                    onChange={e => updateProject(project.id, { status: e.target.value })}
                    style={{ width: 115, fontSize: 11, padding: '4px 8px' }}
                  >
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="on_hold">On hold</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '4px 9px', fontSize: 14, border: 'none', opacity: .5 }}
                    onClick={() => deleteProject(project.id)}
                    title="Delete project"
                  >×</button>
                </div>
              </div>

              {projectTasks.length > 0 && (
                <div style={{ borderTop: '1px solid var(--brd)', paddingTop: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--txt2)', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>
                    {openCount} open · {projectTasks.length} total
                  </div>
                  {projectTasks.slice(0, 5).map((t, i) => (
                    <div key={t.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
                      borderTop: i > 0 ? '1px solid var(--brd)' : 'none',
                      fontSize: 12,
                      color: t.done ? 'var(--txt2)' : 'var(--txt)',
                    }}>
                      <div className={`dot dot-${t.done ? 'done' : t.priority}`} />
                      <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                    </div>
                  ))}
                  {projectTasks.length > 5 && (
                    <div style={{ fontSize: 11, color: 'var(--txt2)', marginTop: 6 }}>+{projectTasks.length - 5} more</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
