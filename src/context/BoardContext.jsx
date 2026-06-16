import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultBoard } from '../data/seed'

const BoardContext = createContext()

function genId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function applyDefaultTaskFields(task) {
  return { ...task, acceptanceCriteria: task.acceptanceCriteria || '', comments: task.comments || [] }
}

const EMPTY_BOARD = {
  columns: [
    { id: 'todo', title: 'To Do', tasks: [], wipLimit: 0 },
    { id: 'in-progress', title: 'In Progress', tasks: [], wipLimit: 0 },
    { id: 'review', title: 'Review', tasks: [], wipLimit: 0 },
    { id: 'done', title: 'Done', tasks: [], wipLimit: 0 },
  ],
  users: [],
  labels: [],
  epics: [],
  sprints: [],
  backlog: [],
  meetings: [],
  activityLog: [],
}

function boardReducer(state, action) {
  switch (action.type) {
    // ── Board tasks ──
    case 'ADD_TASK': {
      const { columnId, task } = action.payload
      const newTask = { ...applyDefaultTaskFields(task), id: genId('task'), createdAt: Date.now() }
      return addLog({
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        ),
        backlog: state.backlog.filter(t => t.id !== task._backlogId),
      }, 'task_added', newTask.title)
    }

    case 'UPDATE_TASK': {
      const { columnId, taskId, updates } = action.payload
      return addLog({
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.map(t => (t.id === taskId ? { ...t, ...applyDefaultTaskFields(updates) } : t)) }
            : col
        ),
      }, 'task_updated', updates.title || '')
    }

    case 'DELETE_TASK': {
      const { columnId, taskId } = action.payload
      const task = state.columns.find(c => c.id === columnId)?.tasks.find(t => t.id === taskId)
      return addLog({
        ...state,
        columns: state.columns.map(col =>
          col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col
        ),
      }, 'task_deleted', task?.title || '')
    }

    case 'MOVE_TASK': {
      const { sourceColId, destColId, taskId, newIndex } = action.payload
      const task = state.columns.find(c => c.id === sourceColId)?.tasks.find(t => t.id === taskId)
      if (!task) return state
      const destCol = state.columns.find(c => c.id === destColId)
      const srcCol = state.columns.find(c => c.id === sourceColId)
      return addLog({
        ...state,
        columns: state.columns.map(col => {
          if (col.id === sourceColId) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
          if (col.id === destColId) {
            const t = [...col.tasks]
            t.splice(newIndex ?? t.length, 0, task)
            return { ...col, tasks: t }
          }
          return col
        }),
      }, 'task_moved', `${task.title} ${srcCol?.title || ''} → ${destCol?.title || ''}`)
    }

    case 'REORDER_TASKS': {
      const { columnId, activeId, overId } = action.payload
      return {
        ...state,
        columns: state.columns.map(col => {
          if (col.id !== columnId) return col
          const tasks = [...col.tasks]
          const oi = tasks.findIndex(t => t.id === activeId)
          const ni = tasks.findIndex(t => t.id === overId)
          if (oi === -1 || ni === -1) return col
          const [r] = tasks.splice(oi, 1)
          tasks.splice(ni, 0, r)
          return { ...col, tasks }
        }),
      }
    }

    case 'ADD_COLUMN': return addLog({ ...state, columns: [...state.columns, { id: genId('col'), title: action.payload.title, tasks: [], wipLimit: action.payload.wipLimit || 0 }] }, 'column_added', action.payload.title)
    case 'UPDATE_COLUMN': return addLog({ ...state, columns: state.columns.map(c => c.id === action.payload.columnId ? { ...c, title: action.payload.title, wipLimit: action.payload.wipLimit ?? c.wipLimit } : c) }, 'column_updated', action.payload.title)
    case 'DELETE_COLUMN': return addLog({ ...state, columns: state.columns.filter(c => c.id !== action.payload.columnId) }, 'column_deleted', '')
    case 'REORDER_COLUMNS': {
      const cols = [...state.columns]
      const oi = cols.findIndex(c => c.id === action.payload.activeId)
      const ni = cols.findIndex(c => c.id === action.payload.overId)
      if (oi === -1 || ni === -1) return state
      const [r] = cols.splice(oi, 1)
      cols.splice(ni, 0, r)
      return { ...state, columns: cols }
    }

    // ── Backlog ──
    case 'ADD_BACKLOG_ITEM': {
      const item = { ...applyDefaultTaskFields(action.payload), id: genId('backlog'), createdAt: Date.now() }
      return addLog({ ...state, backlog: [item, ...state.backlog] }, 'backlog_added', item.title)
    }

    case 'UPDATE_BACKLOG_ITEM': {
      const { id, updates } = action.payload
      return addLog({ ...state, backlog: state.backlog.map(t => t.id === id ? { ...t, ...applyDefaultTaskFields(updates) } : t) }, 'backlog_updated', updates.title || '')
    }

    case 'DELETE_BACKLOG_ITEM': {
      const item = state.backlog.find(t => t.id === action.payload.id)
      return addLog({ ...state, backlog: state.backlog.filter(t => t.id !== action.payload.id) }, 'backlog_deleted', item?.title || '')
    }

    case 'MOVE_BACKLOG_TO_SPRINT': {
      const { backlogId, sprintId } = action.payload
      return addLog({
        ...state,
        backlog: state.backlog.map(t =>
          t.id === backlogId ? { ...t, sprintId } : t
        ),
      }, 'backlog_moved_to_sprint', '')
    }

    case 'MOVE_BACKLOG_TO_COLUMN': {
      const { backlogId, columnId } = action.payload
      const item = state.backlog.find(t => t.id === backlogId)
      if (!item) return state
      const newTask = { ...applyDefaultTaskFields(item), id: genId('task'), createdAt: Date.now(), _backlogId: backlogId }
      return addLog({
        ...state,
        backlog: state.backlog.filter(t => t.id !== backlogId),
        columns: state.columns.map(col =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        ),
      }, 'backlog_started', item.title)
    }

    // ── Labels ──
    case 'ADD_LABEL': return addLog({ ...state, labels: [...state.labels, { ...action.payload, id: genId('label') }] }, 'label_added', action.payload.name)
    case 'UPDATE_LABEL': return addLog({ ...state, labels: state.labels.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l) }, 'label_updated', action.payload.updates.name || '')
    case 'DELETE_LABEL': return addLog({ ...state, labels: state.labels.filter(l => l.id !== action.payload.id) }, 'label_deleted', '')

    // ── Users ──
    case 'ADD_USER': return addLog({ ...state, users: [...state.users, { ...action.payload, id: genId('user') }] }, 'user_added', action.payload.name)
    case 'UPDATE_USER': return addLog({ ...state, users: state.users.map(u => u.id === action.payload.id ? { ...u, ...action.payload.updates } : u) }, 'user_updated', action.payload.updates.name || '')
    case 'DELETE_USER': return addLog({ ...state, users: state.users.filter(u => u.id !== action.payload.id) }, 'user_deleted', '')

    // ── Epics ──
    case 'ADD_EPIC': return addLog({ ...state, epics: [...state.epics, { ...action.payload, id: genId('epic') }] }, 'epic_added', action.payload.title)
    case 'UPDATE_EPIC': return addLog({ ...state, epics: state.epics.map(e => e.id === action.payload.id ? { ...e, ...action.payload.updates } : e) }, 'epic_updated', action.payload.updates.title || '')
    case 'DELETE_EPIC': return addLog({ ...state, epics: state.epics.filter(e => e.id !== action.payload.id) }, 'epic_deleted', '')

    // ── Sprints ──
    case 'ADD_SPRINT': return addLog({ ...state, sprints: [...state.sprints, { ...action.payload, id: genId('sprint') }] }, 'sprint_added', action.payload.name)
    case 'UPDATE_SPRINT': return addLog({ ...state, sprints: state.sprints.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s) }, 'sprint_updated', action.payload.updates.name || '')
    case 'DELETE_SPRINT': return addLog({ ...state, sprints: state.sprints.filter(s => s.id !== action.payload.id) }, 'sprint_deleted', '')

    case 'START_SPRINT': {
      return addLog({
        ...state,
        sprints: state.sprints.map(s => s.id === action.payload.id ? { ...s, isActive: true } : s),
      }, 'sprint_started', state.sprints.find(s => s.id === action.payload.id)?.name || '')
    }

    case 'COMPLETE_SPRINT': {
      const sprint = state.sprints.find(s => s.id === action.payload.id)
      if (!sprint) return state
      const donePoints = state.columns.find(c => c.id === 'done')?.tasks
        .filter(t => t.sprintId === sprint.id)
        .reduce((s, t) => s + (t.points || 0), 0) || 0
      const tasksToReturn = state.columns.flatMap(col =>
        col.tasks.filter(t => t.sprintId === sprint.id && col.id !== 'done')
      )
      const returnedItems = tasksToReturn.map(t => ({
        ...applyDefaultTaskFields(t),
        id: genId('backlog'),
        title: t.title,
        description: t.description,
        priority: t.priority,
        points: t.points,
        epicId: t.epicId,
        assignee: t.assignee || null,
        labels: t.labels || [],
        sprintId: null,
        createdAt: t.createdAt,
      }))
      return addLog({
        ...state,
        sprints: state.sprints.map(s =>
          s.id === action.payload.id ? { ...s, isActive: false, completedAt: Date.now(), completedPoints: donePoints } : s
        ),
        backlog: [...state.backlog, ...returnedItems],
        columns: state.columns.map(col =>
          col.id === 'done'
            ? col
            : { ...col, tasks: col.tasks.filter(t => t.sprintId !== sprint.id) }
        ),
      }, 'sprint_completed', `${sprint.name} (${donePoints}pts)`)
    }

    case 'RESET': return defaultBoard
    case 'CLEAR_ALL': return EMPTY_BOARD
    case 'ADD_LOG': return addLog(state, action.payload.action, action.payload.detail)

    // ── Meetings ──
    case 'ADD_MEETING': return addLog({ ...state, meetings: [...state.meetings, { ...action.payload, id: genId('meeting'), createdAt: Date.now() }] }, 'meeting_added', action.payload.title)
    case 'UPDATE_MEETING': return addLog({ ...state, meetings: state.meetings.map(m => m.id === action.payload.id ? { ...m, ...action.payload.updates } : m) }, 'meeting_updated', action.payload.updates.title || '')
    case 'DELETE_MEETING': return addLog({ ...state, meetings: state.meetings.filter(m => m.id !== action.payload.id) }, 'meeting_deleted', '')

    default:
      return state
  }
}

function addLog(state, action, detail) {
  if (action === 'log_added') return state
  return { ...state, activityLog: [...(state.activityLog || []), { id: genId('log'), action, detail, timestamp: Date.now() }].slice(-200) }
}

function ensureValidUsers(users) {
  const valid = (users || []).map(u => ({
    name: u.name,
    password: u.password || 'pass123',
    role: u.role || 'member',
    avatarColor: u.avatarColor || '#6366f1',
    avatarUrl: u.avatarUrl || null,
    labelAccess: u.labelAccess || [],
    id: u.id,
  }))
  if (!valid.find(u => u.id === defaultBoard.users[0].id)) {
    valid.unshift({ ...defaultBoard.users[0] })
  }
  return valid
}

function migrateBoard(data) {
  if (!data || typeof data !== 'object') return defaultBoard
  return {
    columns: Array.isArray(data.columns) ? data.columns.map(c => ({ ...c, wipLimit: c.wipLimit || 0, tasks: (c.tasks || []).map(applyDefaultTaskFields) })) : defaultBoard.columns,
    users: ensureValidUsers(data.users),
    labels: Array.isArray(data.labels) ? data.labels : defaultBoard.labels,
    epics: Array.isArray(data.epics) ? data.epics : defaultBoard.epics,
    sprints: Array.isArray(data.sprints) ? data.sprints.map(s => ({ ...s, completedPoints: s.completedPoints || 0 })) : defaultBoard.sprints,
    backlog: Array.isArray(data.backlog) ? data.backlog.map(applyDefaultTaskFields) : defaultBoard.backlog,
    meetings: Array.isArray(data.meetings) ? data.meetings : (defaultBoard.meetings || []),
    activityLog: Array.isArray(data.activityLog) ? data.activityLog.slice(-200) : [],
  }
}

export function BoardProvider({ children }) {
  const [stored, setSavedBoard] = useLocalStorage('flowboard-data-v2', null)
  let initial
  try {
    initial = stored ? migrateBoard(stored) : defaultBoard
  } catch {
    initial = defaultBoard
  }
  const [board, dispatch] = useReducer(boardReducer, initial)

  useEffect(() => { setSavedBoard(board) }, [board, setSavedBoard])

  // Board tasks
  const addTask = useCallback((columnId, task) => dispatch({ type: 'ADD_TASK', payload: { columnId, task } }), [])
  const updateTask = useCallback((columnId, taskId, updates) => dispatch({ type: 'UPDATE_TASK', payload: { columnId, taskId, updates } }), [])
  const deleteTask = useCallback((columnId, taskId) => dispatch({ type: 'DELETE_TASK', payload: { columnId, taskId } }), [])
  const moveTask = useCallback((sourceColId, destColId, taskId, newIndex) => dispatch({ type: 'MOVE_TASK', payload: { sourceColId, destColId, taskId, newIndex } }), [])
  const reorderTasks = useCallback((columnId, activeId, overId) => dispatch({ type: 'REORDER_TASKS', payload: { columnId, activeId, overId } }), [])
  const addColumn = useCallback((title, wipLimit = 0) => dispatch({ type: 'ADD_COLUMN', payload: { title, wipLimit } }), [])
  const updateColumn = useCallback((columnId, title, wipLimit) => dispatch({ type: 'UPDATE_COLUMN', payload: { columnId, title, wipLimit } }), [])
  const deleteColumn = useCallback((columnId) => dispatch({ type: 'DELETE_COLUMN', payload: { columnId } }), [])
  const reorderColumns = useCallback((activeId, overId) => dispatch({ type: 'REORDER_COLUMNS', payload: { activeId, overId } }), [])

  // Backlog
  const addBacklogItem = useCallback((item) => dispatch({ type: 'ADD_BACKLOG_ITEM', payload: item }), [])
  const updateBacklogItem = useCallback((id, updates) => dispatch({ type: 'UPDATE_BACKLOG_ITEM', payload: { id, updates } }), [])
  const deleteBacklogItem = useCallback((id) => dispatch({ type: 'DELETE_BACKLOG_ITEM', payload: { id } }), [])
  const moveBacklogToSprint = useCallback((backlogId, sprintId) => dispatch({ type: 'MOVE_BACKLOG_TO_SPRINT', payload: { backlogId, sprintId } }), [])
  const moveBacklogToColumn = useCallback((backlogId, columnId) => dispatch({ type: 'MOVE_BACKLOG_TO_COLUMN', payload: { backlogId, columnId } }), [])

  // Labels
  const addLabel = useCallback((label) => dispatch({ type: 'ADD_LABEL', payload: label }), [])
  const updateLabel = useCallback((id, updates) => dispatch({ type: 'UPDATE_LABEL', payload: { id, updates } }), [])
  const deleteLabel = useCallback((id) => dispatch({ type: 'DELETE_LABEL', payload: { id } }), [])

  // Users
  const addUser = useCallback((user) => dispatch({ type: 'ADD_USER', payload: user }), [])
  const updateUser = useCallback((id, updates) => dispatch({ type: 'UPDATE_USER', payload: { id, updates } }), [])
  const deleteUser = useCallback((id) => dispatch({ type: 'DELETE_USER', payload: { id } }), [])

  // Epics
  const addEpic = useCallback((epic) => dispatch({ type: 'ADD_EPIC', payload: epic }), [])
  const updateEpic = useCallback((id, updates) => dispatch({ type: 'UPDATE_EPIC', payload: { id, updates } }), [])
  const deleteEpic = useCallback((id) => dispatch({ type: 'DELETE_EPIC', payload: { id } }), [])

  // Sprints
  const addSprint = useCallback((sprint) => dispatch({ type: 'ADD_SPRINT', payload: sprint }), [])
  const updateSprint = useCallback((id, updates) => dispatch({ type: 'UPDATE_SPRINT', payload: { id, updates } }), [])
  const deleteSprint = useCallback((id) => dispatch({ type: 'DELETE_SPRINT', payload: { id } }), [])
  const startSprint = useCallback((id) => dispatch({ type: 'START_SPRINT', payload: { id } }), [])
  const completeSprint = useCallback((id) => dispatch({ type: 'COMPLETE_SPRINT', payload: { id } }), [])

  const resetBoard = useCallback(() => dispatch({ type: 'RESET' }), [])
  const clearBoard = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), [])

  const addLog = useCallback((action, detail) => dispatch({ type: 'ADD_LOG', payload: { action, detail } }), [])

  const exportBoard = useCallback(() => {
    const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'flowboard-backup.json'; a.click()
    URL.revokeObjectURL(url)
  }, [board])

  // Meetings
  const addMeeting = useCallback((meeting) => dispatch({ type: 'ADD_MEETING', payload: meeting }), [])
  const updateMeeting = useCallback((id, updates) => dispatch({ type: 'UPDATE_MEETING', payload: { id, updates } }), [])
  const deleteMeeting = useCallback((id) => dispatch({ type: 'DELETE_MEETING', payload: { id } }), [])

  // Helpers
  const getTaskById = useCallback((taskId) => {
    for (const col of board.columns) {
      const t = col.tasks.find(task => task.id === taskId)
      if (t) return t
    }
    return null
  }, [board])

  const getEpicById = useCallback((id) => board.epics.find(e => e.id === id), [board])
  const getSprintById = useCallback((id) => board.sprints.find(s => s.id === id), [board])
  const getLabelColor = useCallback((name) => board.labels.find(l => l.name === name)?.color || '#6b7280', [board])
  const getUserById = useCallback((id) => board.users.find(u => u.id === id), [board])

  const getBacklogForSprint = useCallback((sprintId) => {
    return board.backlog.filter(t => t.sprintId === sprintId)
  }, [board])

  const getColumnTasksForSprint = useCallback((columnId, sprintId) => {
    const col = board.columns.find(c => c.id === columnId)
    if (!col) return []
    return col.tasks.filter(t => !sprintId || t.sprintId === sprintId)
  }, [board])

  const getSprintPoints = useCallback((sprintId) => {
    const colTasks = board.columns.flatMap(c => c.tasks.filter(t => t.sprintId === sprintId))
    const backlogTasks = board.backlog.filter(t => t.sprintId === sprintId)
    const all = [...colTasks, ...backlogTasks]
    const total = all.reduce((sum, t) => sum + (t.points || 0), 0)
    const done = board.columns
      .find(c => c.id === 'done')
      ?.tasks.filter(t => t.sprintId === sprintId)
      .reduce((sum, t) => sum + (t.points || 0), 0) || 0
    return { total, done, remaining: total - done }
  }, [board])

  const getVelocityData = useCallback(() => {
    return board.sprints
      .filter(s => s.completedPoints != null && s.completedPoints > 0)
      .sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0))
      .slice(-10)
      .map(s => ({ name: s.name, points: s.completedPoints }))
  }, [board])

  return (
    <BoardContext.Provider value={{
      board,
      addTask, updateTask, deleteTask, moveTask, reorderTasks,
      addColumn, updateColumn, deleteColumn, reorderColumns,
      addBacklogItem, updateBacklogItem, deleteBacklogItem,
      moveBacklogToSprint, moveBacklogToColumn,
      addEpic, updateEpic, deleteEpic,
      addLabel, updateLabel, deleteLabel,
      addUser, updateUser, deleteUser,
      addSprint, updateSprint, deleteSprint, startSprint, completeSprint,
      addMeeting, updateMeeting, deleteMeeting,
      addLog, exportBoard,
      resetBoard, clearBoard,
      getTaskById, getEpicById, getSprintById, getLabelColor, getUserById,
      getBacklogForSprint, getColumnTasksForSprint, getSprintPoints, getVelocityData,
    }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used within BoardProvider')
  return ctx
}
