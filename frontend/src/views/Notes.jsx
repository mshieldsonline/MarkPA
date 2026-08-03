import { useState } from 'react'

const BLANK = { title: '', content: '' }

export default function Notes({ notes, createNote, updateNote, deleteNote }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) return
    setSaving(true)
    await createNote(form)
    setForm(BLANK)
    setShowForm(false)
    setSaving(false)
  }

  const saveEdit = async (id) => {
    await updateNote(id, editForm)
    setEditing(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#cce8f4' }}>Notes</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <i className="ti ti-plus" />Add note
        </button>
      </div>

      {showForm && (
        <form className="card" style={{ marginBottom: 20 }} onSubmit={submit}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title (optional)…" autoFocus />
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Note content…" rows={4} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {notes.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--txt2)', fontSize: 13 }}>No notes yet</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {notes.map(note => (
          <div key={note.id} className="card">
            {editing === note.id ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <input value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Title…" />
                <textarea value={editForm.content || ''} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} rows={4} style={{ resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => saveEdit(note.id)}>Save</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {note.title && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#cce8f4', marginBottom: 7 }}>{note.title}</div>
                )}
                <p style={{ fontSize: 12, color: 'var(--txt)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {note.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 14 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '3px 10px', fontSize: 11 }}
                    onClick={() => { setEditing(note.id); setEditForm({ title: note.title || '', content: note.content }) }}
                  >Edit</button>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: '3px 9px', fontSize: 14, border: 'none', opacity: .5 }}
                    onClick={() => deleteNote(note.id)}
                    title="Delete note"
                  >×</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
