import { useBoard } from '../context/BoardContext'
import { useTranslation } from '../context/LanguageContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { priorityColors } from '../data/seed'
import { formatDateFull, formatDateShort } from '../utils/dateFormat'

export default function Dashboard() {
  const { board, getSprintPoints, getLabelColor, getVelocityData } = useBoard()
  const { t, language } = useTranslation()

  const allTasks = board.columns.flatMap(col => col.tasks)
  const totalTasks = allTasks.length
  const completedTasks = board.columns.find(c => c.id === 'done')?.tasks.length || 0
  const inProgressTasks = board.columns.find(c => c.id === 'in-progress')?.tasks.length || 0
  const backlogTotal = board.backlog.length

  const columnStats = board.columns.map(col => ({
    name: col.title,
    tasks: col.tasks.length,
  }))

  const priorityData = ['high', 'medium', 'low'].map(p => ({
    name: t('priority.' + p),
    value: allTasks.filter(t => t.priority === p).length,
  }))

  const labelCounts = {}
  allTasks.forEach(t => t.labels?.forEach(l => { labelCounts[l] = (labelCounts[l] || 0) + 1 }))
  board.backlog.forEach(t => t.labels?.forEach(l => { labelCounts[l] = (labelCounts[l] || 0) + 1 }))
  const labelData = Object.entries(labelCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString()))
  const dueSoon = allTasks.filter(t => {
    if (!t.dueDate) return false
    const diff = (new Date(t.dueDate) - new Date(new Date().toDateString())) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 3
  })

  const epicStats = board.epics.map(epic => {
    const taskCount = allTasks.filter(t => t.epicId === epic.id).length
    return { name: epic.title, value: taskCount, color: epic.color }
  }).filter(e => e.value > 0)

  const activeSprint = board.sprints.find(s => s.isActive)

  const userWorkload = board.users.map(user => {
    const boardTasks = allTasks.filter(t => t.assignee === user.id)
    const backlogAssigned = board.backlog.filter(t => t.assignee === user.id)
    const overdue = boardTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString()))
    const totalPoints = boardTasks.reduce((s, t) => s + (t.points || 0), 0) + backlogAssigned.reduce((s, t) => s + (t.points || 0), 0)
    return { ...user, boardTasks: boardTasks.length, backlogItems: backlogAssigned.length, overdue: overdue.length, totalPoints }
  })
  const burndownData = activeSprint ? (() => {
    const start = new Date(activeSprint.startDate)
    const end = new Date(activeSprint.endDate)
    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    const points = getSprintPoints(activeSprint.id)
    const total = points.total || 1

    return Array.from({ length: Math.min(totalDays + 1, 30) }, (_, i) => {
      const col = board.columns.find(c => c.id === 'done')
      const donePts = col?.tasks.filter(t => t.sprintId === activeSprint.id).reduce((s, t) => s + (t.points || 0), 0) || 0
      return {
        day: `Day ${i}`,
        ideal: Math.round((total - (total / totalDays) * i) * 10) / 10,
        actual: Math.round((total - donePts) * 10) / 10,
      }
    })
  })() : null

  return (
    <div className="dashboard">
      <h2 className="page-title">{t('dashboard.title')}</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{totalTasks + backlogTotal}</span>
          <span className="stat-label">{t('dashboard.totalItems')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{inProgressTasks}</span>
          <span className="stat-label">{t('dashboard.inProgress')}</span>
        </div>
        <div className="stat-card stat-card-warning">
          <span className="stat-value">{overdueTasks.length}</span>
          <span className="stat-label">{t('dashboard.overdue')}</span>
        </div>
        <div className="stat-card stat-card-success">
          <span className="stat-value">{completedTasks}</span>
          <span className="stat-label">{t('dashboard.completed')}</span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 0 }}>
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>{t('dashboard.workload')}</h3>
          <div className="workload-list">
            {userWorkload.map(u => (
              <div key={u.id} className="workload-item">
                <div className="workload-user">
                  <div className="user-avatar" style={{ background: u.avatarUrl ? 'transparent' : u.avatarColor, width: 28, height: 28 }}>
                    {u.avatarUrl ? <img src={u.avatarUrl} className="user-avatar-img" /> : u.name[0].toUpperCase()}
                  </div>
                  <span className="workload-name">{u.name}</span>
                </div>
                <div className="workload-stats">
                  <span className="workload-stat">{u.boardTasks} <small>{t('dashboard.boardTasks')}</small></span>
                  <span className="workload-stat">{u.backlogItems} <small>{t('dashboard.backlogItems')}</small></span>
                  <span className="workload-stat">{u.totalPoints} <small>{t('dashboard.assignedPoints')}</small></span>
                  {u.overdue > 0 && <span className="workload-stat workload-overdue">{u.overdue} <small>{t('dashboard.overdue')}</small></span>}
                </div>
                <div className="workload-bar-bg">
                  <div className="workload-bar-fill" style={{ width: `${Math.min((u.boardTasks + u.backlogItems) / Math.max(...userWorkload.map(x => x.boardTasks + x.backlogItems), 1) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(() => {
        const velocityData = getVelocityData()
        if (velocityData.length === 0) return null
        return (
          <div className="dashboard-grid" style={{ marginTop: 0 }}>
            <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
              <h3>{t('dashboard.velocity')}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--text-secondary)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--text-secondary)" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Bar dataKey="points" fill="#22c55e" radius={[4, 4, 0, 0]} name={t('task.storyPoints')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      })()}

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>{t('dashboard.tasksByColumn')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={columnStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--text-secondary)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--text-secondary)" allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>{t('dashboard.tasksByPriority')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={[priorityColors.high.text, priorityColors.medium.text, priorityColors.low.text][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {activeSprint && burndownData && burndownData.length > 1 && (
        <div className="dashboard-grid" style={{ marginTop: 0 }}>
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h3>{t('dashboard.sprintBurndown', { name: activeSprint.name })}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" name={t('dashboard.ideal')} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} name={t('dashboard.actual')} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        {overdueTasks.length > 0 && (
          <div className="section-card section-danger">
            <h3>{t('dashboard.overdueTasks', { count: overdueTasks.length })}</h3>
            <ul>
              {overdueTasks.map(t => (
                <li key={t.id}>
                  <strong>{t.title}</strong>
                  <span>{t('dashboard.due')} {formatDateFull(t.dueDate, language)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dueSoon.length > 0 && (
          <div className="section-card section-warning">
            <h3>{t('dashboard.dueSoon')}</h3>
            <ul>
              {dueSoon.map(t => (
                <li key={t.id}>
                  <strong>{t.title}</strong>
                  <span>{formatDateShort(t.dueDate, language)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {labelData.length > 0 && overdueTasks.length === 0 && dueSoon.length === 0 && (
          <div className="section-card" style={{ gridColumn: '1 / -1' }}>
            <h3>{t('dashboard.labelsOverview')}</h3>
            <div className="label-stats">
              {labelData.map(l => (
                <div key={l.name} className="label-stat-item">
                  <span className="task-label" style={{ background: getLabelColor(l.name) + '20', color: getLabelColor(l.name) }}>{l.name}</span>
                  <span>{l.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
