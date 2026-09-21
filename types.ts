export type GoalStatus = 'not-started' | 'in-progress' | 'submitted' | 'completed'

export interface GoalFeedback {
  id: string
  authorName: string
  authorInitial: string
  timeAgo: string
  comment: string
  likes: number
  comments: number
  hearts: number
}

export interface Milestone {
  id: string
  text: string
  done: boolean
}

export interface Goal {
  id: string
  employeeId: string
  title: string
  description?: string
  category: string
  weightPercent: number
  dueDate: string // ISO date string
  status: GoalStatus
  threshold50: string // "50% Threshold" description
  target100: string // "100% Target" description
  superior150: string // "150% Superior" description
  feedback?: GoalFeedback[]
  milestones?: Milestone[]
}

export interface LibraryGoal {
  id: string
  title: string
  category: string
  description: string
}

export interface Employee {
  id: number
  name: string
  username: string
  password: string
  goal: string
  role?: string
  email?: string
  avatarUrl?: string
}

export type User = Employee
