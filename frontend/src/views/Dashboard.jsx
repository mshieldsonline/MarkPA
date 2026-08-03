export default function Dashboard({ tasks, projects, goals, captures, setView }) {
  const today = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const openTasks = tasks.filter(t => !t.done)
  const overdue   = openTasks.filter(t => t.due_date && t.due_date < today)
  const highPri   = openTasks.filter(t => t.priority === 'high')
  const activeProjects = projects.filter(p => p.status === 'active')
  const avgProgress = goals.length
    ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length)
    : 0

  const summaryParts = []
  if (overdue.length)     summaryParts.push(`${overdue.length} task${overdue.length > 1 ? 's' : ''} overdue`)
  if (highPri.length)     summaryParts.push(`${highPri.length} high-priority open`)
  if (activeProjects.length) summaryParts.push(`${activeProjects.length} active project${activeProjects.length > 1 ? 's' : ''}`)
  if (captures.length)    summaryParts.push(`${captures.length} unprocessed capture${captures.length > 1 ? 's' : ''}`)

  const summaryText = summaryParts.length
    ? summaryParts.join(' · ') + '.'
    : openTasks.length === 0 ? 'No open tasks — looking clear.' : `${openTasks.length} tasks open, no urgent flags.`

  const displayTasks = highPri.length > 0 ? highPri : openTasks

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#cce8f4', marginBottom: 4 }}>
          {greeting}, Mark
        </h1>
        <p style={{ color: 'var(--txt2)', fontSize: 13 }}>Here's what's on today</p>
      </div>

      {/* AI summary placeholder */}
      <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--acc)' }}>
        <div className="card-label">
          <i className="ti ti-sparkles" style={{ marginRight: 5 }} />
          AI summary
        </div>
        <p style={{ fontSize: 13, color: 'var(--txt)', lineHeight: 1.7 }}>
          {summaryText}
          <span style={{ color: 'var(--txt2)', fontSize: 12 }}>
            {' '}Full AI briefing available once your Anthropic API key is configured.
          </span>
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <Stat label="Open tasks"      value={openTasks.length}
          sub={overdue.length > 0 ? `${overdue.length} overdue` : 'on track'}
          accent={overdue.length > 0} onClick={() => setView('tasks')} />
        <Stat label="Active projects" value={activeProjects.length}
          sub="in progress" onClick={() => setView('projects')} />
        <Stat label="Goals"           value={goals.length}
          sub={goals.length ? `avg ${avgProgress}%` : 'none set'} onClick={() => setView('goals')} />
        <Stat label="Captures"        value={captures.length}
          sub="to process" onClick={() => setView('captures')} />
      </div>

      {/* Two-column content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Priority tasks */}
        <div className="card">
          <div className="card-label">
            <i className="ti ti-checkbox" style={{ marginRight: 5 }} />
            {highPri.length > 0 ? 'High priority tasks' : 'Open tasks'}
          </div>
          {openTasks.length === 0 ? (
            <p style={{ color: 'var(--txt2)', fontSize: 12 }}>No open tasks — nice work.</p>
          ) : (
            displayTasks.slice(0, 6).map((task, i) => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 0',
                borderTop: i > 0 ? '1px solid var(--brd)' : 'none',
              }}>
                <div className={`dot dot-${task.priority}`} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.text}
                </span>
                {task.due_date && (
                  <span style={{ fontSize: 11, color: task.due_date < today ? 'var(--high)' : 'var(--txt2)', flexShrink: 0 }}>
                    {task.due_date}
                  </span>
                )}
              </div>
            ))
          )}
          {openTasks.length > 6 && (
            <button className="btn btn-ghost" style={{ marginTop: 10, width: '100%', fontSize: 11 }} onClick={() => setView('tasks')}>
              View all {openTasks.length} tasks
            </button>
          )}
        </div>

        {/* Goals */}
        <div className="card">
          <div className="card-label">
            <i className="ti ti-target" style={{ marginRight: 5 }} />
            Goals
          </div>
          {goals.length === 0 ? (
            <p style={{ color: 'var(--txt2)', fontSize: 12 }}>No goals set yet.</p>
          ) : (
            goals.slice(0, 4).map(goal => (
              <div key={goal.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: 'var(--txt)' }}>{goal.title}</span>
                  <span style={{ fontSize: 12, color: 'var(--acc)', fontWeight: 600 }}>{goal.progress ?? 0}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${goal.progress ?? 0}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI chat placeholder */}
      <div className="card">
        <div className="card-label">
          <i className="ti ti-message-chatbot" style={{ marginRight: 5 }} />
          Ask MarkPA
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="AI chat available once Anthropic API key is configured…"
            disabled
            style={{ opacity: .45 }}
          />
          <button className="btn btn-primary" disabled style={{ opacity: .35 }}>Send</button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, accent, onClick }) {
  return (
    <div className="card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ fontSize: 10, color: 'var(--txt2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.09em' }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent ? 'var(--high)' : '#cce8f4', marginBottom: 2, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: accent ? 'var(--high)' : 'var(--txt2)', opacity: accent ? 1 : .8 }}>{sub}</div>
    </div>
  )
}
