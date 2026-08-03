const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { id: 'tasks',     label: 'Tasks',     icon: 'ti-checkbox'          },
  { id: 'projects',  label: 'Projects',  icon: 'ti-folder'            },
  { id: 'goals',     label: 'Goals',     icon: 'ti-target'            },
  { id: 'notes',     label: 'Notes',     icon: 'ti-notes'             },
  { id: 'captures',  label: 'Captures',  icon: 'ti-bolt'              },
]

export default function Sidebar({ view, setView, captureCount }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">MarkPA</div>
      {NAV.map(item => (
        <div
          key={item.id}
          className={`sidebar-nav${view === item.id ? ' active' : ''}`}
          onClick={() => setView(item.id)}
        >
          <i className={`ti ${item.icon}`} aria-hidden />
          {item.label}
          {item.id === 'captures' && captureCount > 0 && (
            <span className="sidebar-count">{captureCount}</span>
          )}
        </div>
      ))}
    </div>
  )
}
