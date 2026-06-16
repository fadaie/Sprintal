const now = Date.now()
const day = 86400000

export const AVATAR_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#eab308', '#84cc16', '#ef4444', '#8b5cf6', '#06b6d4']

export function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

export const defaultBoard = {
  columns: [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ],
  users: [
    { id: 'user-admin', name: 'Admin', password: 'admin', role: 'admin', avatarColor: '#6366f1', labelAccess: [] },
    { id: 'user-1', name: 'Alice', password: 'alice', role: 'admin', avatarColor: '#6366f1', labelAccess: [] },
    { id: 'user-2', name: 'Bob', password: 'bob', role: 'member', avatarColor: '#ec4899', labelAccess: ['backend', 'security'] },
    { id: 'user-3', name: 'Charlie', password: 'charlie', role: 'member', avatarColor: '#14b8a6', labelAccess: ['frontend', 'design'] },
  ],
  labels: [
    { id: 'l-frontend', name: 'frontend', color: '#6366f1' },
    { id: 'l-backend', name: 'backend', color: '#ec4899' },
    { id: 'l-design', name: 'design', color: '#8b5cf6' },
    { id: 'l-devops', name: 'devops', color: '#14b8a6' },
    { id: 'l-research', name: 'research', color: '#f97316' },
    { id: 'l-docs', name: 'docs', color: '#06b6d4' },
    { id: 'l-review', name: 'review', color: '#eab308' },
    { id: 'l-refactor', name: 'refactor', color: '#84cc16' },
    { id: 'l-security', name: 'security', color: '#ef4444' },
  ],
  epics: [
    { id: 'epic-1', title: 'User Authentication', description: 'Login, registration, password reset, SSO', color: '#6366f1' },
    { id: 'epic-2', title: 'Payment System', description: 'Subscription plans, billing, invoicing', color: '#ec4899' },
    { id: 'epic-3', title: 'Dashboard & Analytics', description: 'User dashboards, charts, reporting', color: '#14b8a6' },
  ],
  sprints: [
    {
      id: 'sprint-1',
      name: 'Sprint 1 — Foundation',
      goal: 'Set up project infrastructure and core authentication',
      startDate: new Date(now - 10 * day).toISOString().split('T')[0],
      endDate: new Date(now + 4 * day).toISOString().split('T')[0],
      isActive: true,
    },
    {
      id: 'sprint-2',
      name: 'Sprint 2 — Payments',
      goal: 'Implement payment processing and subscription management',
      startDate: new Date(now + 5 * day).toISOString().split('T')[0],
      endDate: new Date(now + 19 * day).toISOString().split('T')[0],
      isActive: false,
    },
  ],
  backlog: [
    { id: 'backlog-1', title: 'Social login (Google, GitHub)', description: 'Add OAuth2 authentication providers for Google and GitHub.', priority: 'medium', points: 5, epicId: 'epic-1', labels: ['backend', 'security'], assignee: 'user-1', createdAt: now - 14 * day },
    { id: 'backlog-2', title: 'Password reset flow', description: 'Implement forgot password with email verification and reset form.', priority: 'high', points: 3, epicId: 'epic-1', labels: ['backend', 'frontend'], assignee: 'user-2', createdAt: now - 12 * day },
    { id: 'backlog-3', title: 'Invoice PDF generation', description: 'Generate and email PDF invoices for completed billing cycles.', priority: 'low', points: 8, epicId: 'epic-2', labels: ['backend', 'docs'], assignee: null, createdAt: now - 10 * day },
    { id: 'backlog-4', title: 'Usage analytics dashboard', description: 'Build charts for user activity, feature usage, and adoption metrics.', priority: 'medium', points: 13, epicId: 'epic-3', labels: ['frontend', 'design'], assignee: 'user-3', createdAt: now - 8 * day },
    { id: 'backlog-5', title: 'Role-based access control', description: 'Implement admin, manager, and viewer roles with permission checks.', priority: 'high', points: 8, epicId: 'epic-1', labels: ['backend', 'security'], assignee: 'user-1', createdAt: now - 6 * day },
    { id: 'backlog-6', title: 'Report scheduling', description: 'Allow users to schedule recurring reports via email.', priority: 'low', points: 5, epicId: 'epic-3', labels: ['backend'], assignee: null, createdAt: now - 4 * day },
    { id: 'backlog-7', title: 'Cancel subscription', description: 'Allow users to cancel their subscription with confirmation and proration.', priority: 'high', points: 3, epicId: 'epic-2', labels: ['backend', 'frontend'], assignee: 'user-2', createdAt: now - 3 * day },
    { id: 'backlog-8', title: 'Export dashboard to CSV', description: 'Add CSV export button to all dashboard data tables.', priority: 'low', points: 2, epicId: 'epic-3', labels: ['frontend'], assignee: 'user-3', createdAt: now - 2 * day },
  ],
  meetings: [],
  activityLog: [],
}

export const priorityColors = {
  high: { bg: '#fef2f2', text: '#dc2626', darkBg: '#3b1010', darkText: '#fca5a5' },
  medium: { bg: '#fffbeb', text: '#d97706', darkBg: '#3b2f10', darkText: '#fde68a' },
  low: { bg: '#f0fdf4', text: '#16a34a', darkBg: '#103b18', darkText: '#86efac' },
}

export const pointsOptions = [1, 2, 3, 5, 8, 13, 21]
