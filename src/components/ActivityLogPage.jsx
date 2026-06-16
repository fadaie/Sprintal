import { useBoard } from '../context/BoardContext'
import { useTranslation } from '../context/LanguageContext'
import { formatDateFull } from '../utils/dateFormat'

const actionLabels = {
  task_added: '➕ Task added',
  task_updated: '✏️ Task updated',
  task_deleted: '🗑️ Task deleted',
  task_moved: '↔️ Task moved',
  backlog_added: '➕ Backlog added',
  backlog_updated: '✏️ Backlog updated',
  backlog_deleted: '🗑️ Backlog deleted',
  backlog_started: '▶️ Backlog started',
  backlog_moved_to_sprint: '📋 Moved to sprint',
  column_added: '📐 Column added',
  column_updated: '✏️ Column updated',
  column_deleted: '🗑️ Column deleted',
  label_added: '🏷️ Label added',
  label_updated: '✏️ Label updated',
  label_deleted: '🗑️ Label deleted',
  user_added: '👤 User added',
  user_updated: '✏️ User updated',
  user_deleted: '🗑️ User deleted',
  epic_added: '⚡ Epic added',
  epic_updated: '✏️ Epic updated',
  epic_deleted: '🗑️ Epic deleted',
  sprint_added: '🚀 Sprint added',
  sprint_updated: '✏️ Sprint updated',
  sprint_deleted: '🗑️ Sprint deleted',
  sprint_started: '▶️ Sprint started',
  sprint_completed: '✅ Sprint completed',
  meeting_added: '📅 Meeting added',
  meeting_updated: '✏️ Meeting updated',
  meeting_deleted: '🗑️ Meeting deleted',
}

export default function ActivityLogPage() {
  const { board } = useBoard()
  const { t, language } = useTranslation()
  const logs = [...(board.activityLog || [])].reverse()

  return (
    <div className="activity-page">
      <h2 className="page-title">{t('activityLog.title')}</h2>
      {logs.length === 0 && <div className="empty-state">{t('activityLog.empty')}</div>}
      <div className="activity-list">
        {logs.map(log => (
          <div key={log.id} className="activity-item">
            <div className="activity-action">{actionLabels[log.action] || log.action}</div>
            {log.detail && <div className="activity-detail">{log.detail}</div>}
            <div className="activity-time">{formatDateFull(new Date(log.timestamp).toISOString().split('T')[0], language)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
