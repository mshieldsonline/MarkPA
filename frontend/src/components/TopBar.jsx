export default function TopBar() {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="topbar">
      <span className="topbar-date">{dateStr}</span>
      <div className="topbar-avatar">M</div>
    </div>
  )
}
