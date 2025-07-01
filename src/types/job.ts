// Job/Item/Goal models for manufacturing expeditor

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'late' | 'on_hold' | 'cancelled'
export type PriorityLevel = 'low' | 'normal' | 'high' | 'critical'

export interface Job {
  id: string
  name: string
  description?: string
  status: JobStatus
  dueDate: string // ISO date
  startDate?: string // ISO date
  completedDate?: string // ISO date
  priority: PriorityLevel
  assignedTo?: string // user or team id
  organizationId: string
  itemIds?: string[]
  lastUpdated: string // ISO date
  customFields?: Record<string, any>
}

export interface Item {
  id: string
  name: string
  jobId: string
  status: JobStatus
  quantity: number
  location?: string
  customFields?: Record<string, any>
}

export interface Goal {
  id: string
  organizationId: string
  name: string
  description?: string
  type: 'on_time' | 'throughput' | 'custom'
  targetValue: number
  currentValue: number
  unit: string // e.g., '%', 'jobs/day'
  startDate: string // ISO date
  endDate?: string // ISO date
  achieved: boolean
  lastEvaluated: string // ISO date
}

export interface PriorityChange {
  jobId: string
  oldPriority: PriorityLevel
  newPriority: PriorityLevel
  changedBy: string // user id
  changedAt: string // ISO date
  reason?: string
} 