import { useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useBoard } from '../context/BoardContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from '../context/LanguageContext'
import Column from './Column'

export default function Board({ sprintFilter }) {
  const { board, addTask, updateTask, deleteTask, moveTask, reorderTasks, addColumn, updateColumn, deleteColumn, reorderColumns } = useBoard()
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [activeTask, setActiveTask] = useState(null)
  const [newColTitle, setNewColTitle] = useState('')
  const [newColWip, setNewColWip] = useState(0)
  const [showNewCol, setShowNewCol] = useState(false)
  const [assigneeFilter, setAssigneeFilter] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )
  const isAdmin = currentUser?.role === 'admin'

  function filterTasks(column) {
    let tasks = column.tasks
    if (sprintFilter) tasks = tasks.filter(t => t.sprintId === sprintFilter)
    if (assigneeFilter) tasks = tasks.filter(t => t.assignee === assigneeFilter)
    return tasks
  }

  function canMoveTask(task) {
    return isAdmin || task.assignee === currentUser?.id
  }

  function handleDragStart(event) {
    const data = event.active.data.current
    if (data?.type === 'task') setActiveTask(data.task)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'column' && overData?.type === 'column') {
      if (!isAdmin) return
      reorderColumns(active.id, over.id)
      return
    }

    if (activeData?.type === 'task') {
      if (!canMoveTask(activeData.task)) return
      const activeColId = activeData.columnId
      if (overData?.type === 'task') {
        const overColId = overData.columnId
        if (activeColId === overColId) {
          reorderTasks(activeColId, active.id, over.id)
        } else {
          const overCol = board.columns.find(c => c.id === overColId)
          const overIndex = overCol ? overCol.tasks.findIndex(t => t.id === over.id) : 0
          moveTask(activeColId, overColId, active.id, overIndex)
        }
      } else if (overData?.type === 'column') {
        moveTask(activeColId, overData.column.id, active.id)
      }
    }
  }

  function handleAddColumn() {
    if (!newColTitle.trim()) return
    addColumn(newColTitle.trim(), newColWip)
    setNewColTitle('')
    setNewColWip(0)
    setShowNewCol(false)
  }

  const activeSprint = board.sprints.find(s => s.isActive)

  return (
    <div className="board-wrapper">
      {sprintFilter && (
        <div className="board-context-bar">
          {t('board.showingSprint')} <strong>{board.sprints.find(s => s.id === sprintFilter)?.name || 'Sprint'}</strong>
        </div>
      )}
      {!sprintFilter && activeSprint && (
        <div className="board-context-bar board-context-bar-info">
          {t('board.activeSprint')}: <strong>{activeSprint.name}</strong>
          {' — '}
          <em>{activeSprint.goal}</em>
        </div>
      )}

      {board.users.length > 0 && (
        <div className="board-filters">
          <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)}>
            <option value="">{t('board.allAssignees')}</option>
            <option value="_unassigned">{t('board.unassigned')}</option>
            {board.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
          <div className="board">
            {board.columns.map(col => (
              <Column
                key={col.id}
                column={{ ...col, tasks: filterTasks(col) }}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onDeleteColumn={deleteColumn}
                onRenameColumn={updateColumn}
              />
            ))}

            {showNewCol ? (
              <div className="column add-column-card">
                <input className="column-rename-input" placeholder={t('board.columnPlaceholder')} value={newColTitle}
                  onChange={e => setNewColTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') { setShowNewCol(false); setNewColTitle('') } }}
                  onBlur={handleAddColumn} autoFocus />
                <input className="column-wip-input" type="number" min="0" placeholder={t('wip.hint')} value={newColWip}
                  onChange={e => setNewColWip(Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
            ) : isAdmin && (
              <button className="add-column-btn" onClick={() => setShowNewCol(true)}>{t('board.addColumn')}</button>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <div className="task-card task-card-dragging">
              <h3>{activeTask.title}</h3>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
