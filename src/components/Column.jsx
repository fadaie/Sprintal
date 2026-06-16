import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import ConfirmModal from './ConfirmModal'

export default function Column({ column, onAddTask, onUpdateTask, onDeleteTask, onDeleteColumn, onRenameColumn }) {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const isAdmin = currentUser?.role === 'admin'
  const [showNewTask, setShowNewTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameTitle, setRenameTitle] = useState(column.title)
  const [showDeleteCol, setShowDeleteCol] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  })

  const handleSaveNew = (taskData) => {
    onAddTask(column.id, taskData)
    setShowNewTask(false)
  }

  const handleUpdate = (taskData) => {
    if (editingTask) {
      onUpdateTask(column.id, editingTask.id, taskData)
      setEditingTask(null)
    }
  }

  const handleDelete = () => {
    if (deleting) {
      onDeleteTask(column.id, deleting.id)
      setDeleting(null)
    }
  }

  const handleRename = () => {
    if (renameTitle.trim() && renameTitle !== column.title) {
      onRenameColumn(column.id, renameTitle.trim())
    }
    setIsRenaming(false)
  }

  return (
    <div className={`column ${isOver ? 'column-over' : ''}`} ref={setNodeRef}>
      <div className="column-header">
        {isRenaming ? (
          <input
            className="column-rename-input"
            value={renameTitle}
            onChange={e => setRenameTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setRenameTitle(column.title); setIsRenaming(false) } }}
            autoFocus
          />
        ) : (
          <h3 className="column-title" onDoubleClick={() => { if (isAdmin) { setRenameTitle(column.title); setIsRenaming(true) } }}>
            {column.title}
            <span className="task-count">{column.tasks.length}</span>
            {column.wipLimit > 0 && (
              <span className={`wip-badge ${column.tasks.length > column.wipLimit ? 'wip-exceeded' : ''}`}>
                {column.tasks.length}/{column.wipLimit}
              </span>
            )}
          </h3>
        )}
        <div className="column-actions">
          {isAdmin && <button className="btn-icon" onClick={() => setShowDeleteCol(true)} aria-label={t('column.deleteColumn')} title={t('column.deleteColumn')}>&times;</button>}
        </div>
      </div>

      <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="column-tasks">
          {column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onEdit={(t, cid) => setEditingTask(t)}
              onDelete={(t, cid) => setDeleting(t)}
            />
          ))}
          {column.tasks.length === 0 && (
            <div className="empty-state">{t('column.dropHere')}</div>
          )}
        </div>
      </SortableContext>

      {showNewTask && (
        <TaskModal
          columnId={column.id}
          onSave={handleSaveNew}
          onClose={() => setShowNewTask(false)}
        />
      )}
      {editingTask && (
        <TaskModal
          task={editingTask}
          columnId={column.id}
          onSave={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
      {deleting && (
        <ConfirmModal
          title={t('task.delete')}
          message={t('task.deleteConfirm', { title: deleting.title })}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      {showDeleteCol && (
        <ConfirmModal
          title={t('column.deleteColumn')}
          message={`${t('column.deleteColumn')} "${column.title}"?`}
          onConfirm={() => { onDeleteColumn(column.id); setShowDeleteCol(false) }}
          onCancel={() => setShowDeleteCol(false)}
          confirmLabel={t('confirm.delete')}
        />
      )}
    </div>
  )
}
