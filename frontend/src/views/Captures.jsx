import { useState } from 'react'

export default function Captures({ captures, createCapture, promoteCapture, deleteCapture }) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    await createCapture(text.trim())
    setText('')
    setSaving(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cce8f4', marginBottom: 4 }}>Captures</h2>
        <p style={{ fontSize: 12, color: 'var(--txt2)' }}>Quick brain dump — get it out of your head, process it later</p>
      </div>

      <form className="card" style={{ marginBottom: 20 }} onSubmit={submit}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind…"
            autoFocus
          />
          <button type="submit" className="btn btn-primary" disabled={saving || !text.trim()} style={{ flexShrink: 0 }}>
            <i className="ti ti-bolt" />Capture
          </button>
        </div>
      </form>

      {captures.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--txt2)', fontSize: 13 }}>
          Nothing captured yet — type above to add something
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {captures.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="ti ti-bolt" style={{ color: 'var(--txt2)', fontSize: 13, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--txt)' }}>{c.text}</span>
            <span style={{ fontSize: 11, color: 'var(--txt2)', flexShrink: 0 }}>
              {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
            <button
              className="btn btn-ghost"
              style={{ padding: '4px 11px', fontSize: 11, flexShrink: 0 }}
              onClick={() => promoteCapture(c.id)}
              title="Promote to task"
            >
              <i className="ti ti-checkbox" style={{ fontSize: 11 }} />Task
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '4px 9px', fontSize: 14, border: 'none', opacity: .5, flexShrink: 0 }}
              onClick={() => deleteCapture(c.id)}
              title="Delete"
            >×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
