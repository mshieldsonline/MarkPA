import { useState } from 'react'

const BLANK = { title: '', target_description: '', progress: 0 }

export default function Goals({ goals, createGoal, updateGoal, deleteGoal }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    await createGoal(form)
    setForm(BLANK)
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cce8f4' }}>Goals</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <i className="ti ti-plus" />Add goal
        </button>
      </div>

      {showForm && (
        <form className="card" style={{ marginBottom: 16 }} onSubmit={submit}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Goal title…" autoFocus />
            <textarea value={form.target_description} onChange={e => setForm(f => ({ ...f, target_description: e.target.value }))} placeholder="What does success look like? (optional)" rows={2} style={{ resize: 'none' }} />
            <div>
              <label style={{ fontSize: 11, color: 'var(--txt2)', display: 'block', marginBottom: 6 }}>
                Starting progress: <strong style={{ color: 'var(--acc)' }}>{form.progress}%</strong>
              </label>
              <input
                type="range" min="0" max="100"
                value={form.progress}
                onChange={e => setForm(f => ({ ...f, progress: +e.target.value }))}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {goals.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--txt2)', fontSize: 13 }}>No goals set yet</div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} onUpdate={data => updateGoal(goal.id, data)} onDelete={() => deleteGoal(goal.id)} />
        ))}
      </div>
    </div>
  )
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const progress = goal.progress ?? 0

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#cce8f4', marginBottom: 4 }}>{goal.title}</div>
          {goal.target_description && (
            <p style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6 }}>{goal.target_description}</p>
          )}
        </div>
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 9px', fontSize: 14, border: 'none', opacity: .5, flexShrink: 0 }}
          onClick={onDelete}
          title="Delete goal"
        >×</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <input
          type="range" min="0" max="100"
          value={progress}
          onChange={e => onUpdate({ progress: +e.target.value })}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--acc)', minWidth: 42, textAlign: 'right' }}>
          {progress}%
        </span>
      </div>
      <div className="progress-track" style={{ marginTop: 8 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
