import { Job, Goal } from '../types/job'

// Calculate on-time percentage
export function calculateOnTimePercentage(jobs: Job[]): number {
  const completed = jobs.filter(j => j.status === 'completed')
  if (completed.length === 0) return 0
  const onTime = completed.filter(j =>
    j.completedDate && j.dueDate && j.completedDate <= j.dueDate
  )
  return (onTime.length / completed.length) * 100
}

// Calculate throughput (jobs completed per day)
export function calculateThroughput(jobs: Job[], startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const completed = jobs.filter(j =>
    j.status === 'completed' &&
    j.completedDate &&
    new Date(j.completedDate) >= start &&
    new Date(j.completedDate) <= end
  )
  const days = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return completed.length / days
}

// Evaluate if a goal is achieved
export function evaluateGoal(goal: Goal, jobs: Job[]): boolean {
  if (goal.type === 'on_time') {
    return calculateOnTimePercentage(jobs) >= goal.targetValue
  }
  if (goal.type === 'throughput') {
    return calculateThroughput(jobs, goal.startDate, goal.endDate || new Date().toISOString()) >= goal.targetValue
  }
  // Custom goal: implement as needed
  return goal.achieved
}

// Suggest job reordering to meet on-time goal (simple: prioritize late/pending jobs)
export function suggestJobReordering(jobs: Job[]): Job[] {
  return jobs.slice().sort((a, b) => {
    // Prioritize late, then pending, then by due date
    const statusOrder = { late: 0, pending: 1, in_progress: 2, on_hold: 3, completed: 4, cancelled: 5 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return (a.dueDate || '').localeCompare(b.dueDate || '')
  })
} 