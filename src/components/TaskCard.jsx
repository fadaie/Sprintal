import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { priorityColors } from '../data/seed'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import { formatDateShort } from '../utils/dateFormat'

export default function TaskCard({ task, columnId, onEdit, onDelete }) {
  const { getEpicById, getLabelColor, getUserById } = useBoard()
  const { currentUser } = useAuth()
  const { language } = useTranslation()
  const isAdmin = currentUser?.role === 'admin'
  const canAct = isAdmin || task.assignee === currentUser?.id

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task, columnId },
    disabled: !canAct,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const priority = priorityColors[task.priority]
  const epic = task.epicId ? getEpicById(task.epicId) : null
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString())
  const isToday = task.dueDate === new Date().toISOString().split('T')[0]
  const assigneeUser = task.assignee ? getUserById(task.assignee) : null

  return (
    <div ref={setNodeRef} style={style} className="task-card" {...attributes} {...listeners}>
      <div className="task-card-header">
        <div className="task-card-header-left">
          <span className="task-priority" style={{ background: priority?.bg, color: priority?.text }}>
            {task.priority}
          </span>
          {task.points && <span className="points-badge points-badge-sm">{task.points}pt</span>}
        </div>
        {isAdmin && <button className="btn-icon btn-icon-sm" onClick={(e) => { e.stopPropagation(); onDelete(task, columnId) }} aria-label="Delete task">&times;</button>}
      </div>
      {epic && <div className="task-epic-line" style={{ background: epic.color }} />}
      <h3 className="task-title" style={canAct ? {} : { cursor: 'default' }} onClick={() => canAct && onEdit(task, columnId)}>{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-footer">
        {assigneeUser && <div className="user-avatar user-avatar-sm" style={{ background: assigneeUser.avatarUrl ? 'transparent' : assigneeUser.avatarColor }} title={assigneeUser.name}>{assigneeUser.avatarUrl ? <img src={assigneeUser.avatarUrl} className="user-avatar-img" /> : assigneeUser.name[0].toUpperCase()}</div>}
        <div className="task-labels">
          {task.labels?.map(label => <span key={label} className="task-label" style={{ background: getLabelColor(label) + '20', color: getLabelColor(label) }}>{label}</span>)}
        </div>
          {task.dueDate && (
          <span className={`task-date ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}>
            {isOverdue && <>&#9888;</>}
            {formatDateShort(task.dueDate, language)}
          </span>
        )}
        {task.acceptanceCriteria && <span className="task-meta-icon" title="Has acceptance criteria">&#10003;</span>}
        {task.comments?.length > 0 && <span className="task-meta-icon" title={task.comments.length + ' comment(s)'}>&#128172;{task.comments.length}</span>}
      </div>
    </div>
  )
}
