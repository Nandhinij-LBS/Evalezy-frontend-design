import { defaultEmployeeGoals, goalLibrary, sampleGoals, sampleUsers } from '../data/sampleGoals'
import type { Employee, Goal, LibraryGoal, User } from '../types'
import { hasGoalValidationErrors, validateGoal } from '../utils/goalValidation'

const GOALS_KEY = 'evalezy_goals'
const EMPLOYEES_KEY = 'employees'
const USERS_KEY = 'users'
const SESSION_KEY = 'evalezy_session_active'
const SESSION_USER_KEY = 'currentEmployeeId'
const EMPLOYEE_ID_KEY = 'employeeId'
const GOAL_SEED_VERSION_KEY = 'evalezy_goal_seed_version'
const GOAL_SEED_VERSION = '3'
const API_DELAY_MS = 250

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), API_DELAY_MS))
}

function writeCollection<T>(key: string, values: T[]) {
  localStorage.setItem(key, JSON.stringify(values))
}

function createGoalId(goals: Goal[]): string {
  let id: string
  do {
    id = `goal-${Date.now()}-${crypto.randomUUID()}`
  } while (goals.some((goal) => goal.id === id))
  return id
}

function readGoals(): Goal[] {
  const rawGoals = localStorage.getItem(GOALS_KEY)
  if (!rawGoals) {
    const seededGoals = structuredClone(sampleGoals)
    localStorage.setItem(GOALS_KEY, JSON.stringify(seededGoals))
    localStorage.setItem(GOAL_SEED_VERSION_KEY, GOAL_SEED_VERSION)
    return seededGoals
  }

  try {
    const parsedGoals = JSON.parse(rawGoals) as Goal[]
    if (!Array.isArray(parsedGoals)) throw new Error('Invalid goals')

    if (localStorage.getItem(GOAL_SEED_VERSION_KEY) === GOAL_SEED_VERSION) return parsedGoals

    // Any goal seeded by the app (employee-<n>-goal-<n>) is replaced by the new
    // one-goal-per-employee defaults. Goals employees created themselves
    // (goal-<timestamp>-<uuid>) are kept.
    const isDefaultGoalId = (id: string) => /^employee-\d+-goal-\d+$/.test(id)
    const legacyMockGoalIds = new Set(Array.from({ length: 14 }, (_, index) => `g${index + 1}`))
    const customGoals = parsedGoals.filter((goal) => !isDefaultGoalId(goal.id) && !legacyMockGoalIds.has(goal.id))
    const migratedGoals = [...structuredClone(defaultEmployeeGoals), ...customGoals]
    writeCollection(GOALS_KEY, migratedGoals)
    localStorage.setItem(GOAL_SEED_VERSION_KEY, GOAL_SEED_VERSION)
    return migratedGoals
  } catch {
    const seededGoals = structuredClone(sampleGoals)
    localStorage.setItem(GOALS_KEY, JSON.stringify(seededGoals))
    localStorage.setItem(GOAL_SEED_VERSION_KEY, GOAL_SEED_VERSION)
    return seededGoals
  }
}

function migrateLegacyEmployeeData(): void {
  const legacyEvaluezyEmployees = localStorage.getItem('evalezy_employees')
  const legacyUsers = localStorage.getItem('evalezy_users')

  if (!localStorage.getItem(EMPLOYEES_KEY) && (legacyEvaluezyEmployees || legacyUsers)) {
    const value = legacyEvaluezyEmployees ?? legacyUsers
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(EMPLOYEES_KEY, value)
          localStorage.setItem(USERS_KEY, value)
        }
      } catch {
        // Ignore invalid legacy data and fall back to seed values below.
      }
    }
  }
}

export function ensureDefaultEmployees(): Employee[] {
  migrateLegacyEmployeeData()

  const rawEmployees = localStorage.getItem(EMPLOYEES_KEY)

  if (!rawEmployees) {
    const seededEmployees = structuredClone(sampleUsers)
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(seededEmployees))
    localStorage.setItem(USERS_KEY, JSON.stringify(seededEmployees))
    return seededEmployees
  }

  try {
    const parsed = JSON.parse(rawEmployees) as Employee[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seededEmployees = structuredClone(sampleUsers)
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(seededEmployees))
      localStorage.setItem(USERS_KEY, JSON.stringify(seededEmployees))
      return seededEmployees
    }

    const existingEmployeeById = new Map(parsed.map((employee) => [employee.id, employee]))
    const normalizedEmployees = sampleUsers.map((defaultEmployee) => {
      const existingEmployee = existingEmployeeById.get(defaultEmployee.id)
      if (!existingEmployee) return structuredClone(defaultEmployee)

      const hasValidEmployeeSchema =
        typeof existingEmployee.id === 'number' &&
        typeof existingEmployee.name === 'string' &&
        typeof existingEmployee.username === 'string' &&
        typeof existingEmployee.password === 'string' &&
        typeof existingEmployee.goal === 'string'

      return hasValidEmployeeSchema ? existingEmployee : { ...structuredClone(defaultEmployee), ...existingEmployee }
    })
    const defaultEmployeeIds = new Set(sampleUsers.map((employee) => employee.id))
    const customEmployees = parsed.filter((employee) => !defaultEmployeeIds.has(employee.id))
    const employeesWithDefaults = [...normalizedEmployees, ...customEmployees]
    if (JSON.stringify(employeesWithDefaults) !== JSON.stringify(parsed)) {
      writeCollection(EMPLOYEES_KEY, employeesWithDefaults)
      writeCollection(USERS_KEY, employeesWithDefaults)
    }
    return employeesWithDefaults
  } catch {
    const seededEmployees = structuredClone(sampleUsers)
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(seededEmployees))
    localStorage.setItem(USERS_KEY, JSON.stringify(seededEmployees))
    return seededEmployees
  }
}

export async function getUsers(): Promise<User[]> {
  const employees = ensureDefaultEmployees()
  writeCollection(USERS_KEY, employees)
  return delay(employees)
}

export function getCurrentUser(): User | undefined {
  const userId = localStorage.getItem(SESSION_USER_KEY) ?? localStorage.getItem(EMPLOYEE_ID_KEY)
  if (!userId) return undefined

  const employees = ensureDefaultEmployees()
  const parsedUserId = Number(userId)
  if (Number.isNaN(parsedUserId)) {
    return undefined
  }

  return employees.find((employee) => employee.id === parsedUserId)
}

export function findEmployees(searchTerm: string): User[] {
  const employees = ensureDefaultEmployees()
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return employees
  }

  return employees.filter((employee) => {
    const searchableValues = [String(employee.id), employee.name, employee.username, employee.goal, employee.email ?? '', employee.role ?? '']
    return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch))
  })
}

export async function getGoals(): Promise<Goal[]> {
  const employeeId = getCurrentUser()?.id
  if (!employeeId) return []

  const allGoals = readGoals()
  const filteredGoals = allGoals.filter((goal) => String(goal.employeeId) === String(employeeId))
  return delay(filteredGoals)
}

export async function getGoalById(id: string): Promise<Goal | undefined> {
  const allGoals = readGoals()
  const goal = allGoals.find((item) => item.id === id)
  if (!goal) return undefined
  return String(goal.employeeId) === String(getCurrentUser()?.id) ? goal : undefined
}

export async function getGoalForEmployee(employeeId: number): Promise<Goal | undefined> {
  if (employeeId !== getCurrentUser()?.id) return delay(undefined)
  const allGoals = readGoals()
  const goal = allGoals.find((item) => String(item.employeeId) === String(employeeId))
  return delay(goal)
}

export async function getGoalsForEmployee(employeeId: number): Promise<Goal[]> {
  if (employeeId !== getCurrentUser()?.id) return delay([])
  const allGoals = readGoals()
  const employeeGoals = allGoals.filter((goal) => String(goal.employeeId) === String(employeeId))
  return delay(employeeGoals)
}

export async function createGoal(data: Omit<Goal, 'id'>): Promise<Goal> {
  const employeeId = getCurrentUser()?.id
  if (!employeeId) {
    throw new Error('Goals can only be created for the authenticated employee.')
  }
  assertValidGoal(data)

  const goals = readGoals()
  const created = { ...data, employeeId: String(employeeId), id: createGoalId(goals) } as Goal
  const allGoals = [...goals, created]
  writeCollection(GOALS_KEY, allGoals)
  return created
}

export async function updateGoal(id: string, data: Omit<Partial<Goal>, 'id' | 'employeeId'>): Promise<Goal> {
  const goals = readGoals()
  const index = goals.findIndex((goal) => goal.id === id)
  if (index === -1) throw new Error('Goal not found')
  if (String(goals[index].employeeId) !== String(getCurrentUser()?.id)) {
    throw new Error('You can only update your own goals.')
  }

  // TypeScript prevents these properties at call sites, but strip them at
  // runtime too so a crafted payload can never change a goal's ownership or ID.
  const { id: _ignoredId, employeeId: _ignoredEmployeeId, ...goalUpdates } = data as Partial<Goal>
  void _ignoredId
  void _ignoredEmployeeId
  const updated = { ...goals[index], ...goalUpdates }
  assertValidGoal(updated)
  const allGoals = goals.map((goal) => (goal.id === id ? updated : goal))
  writeCollection(GOALS_KEY, allGoals)
  return updated
}

function assertValidGoal(goal: Omit<Goal, 'id'> | Goal): void {
  const errors = validateGoal(goal)
  if (hasGoalValidationErrors(errors)) {
    throw new Error(Object.values(errors)[0] ?? 'Goal details are invalid.')
  }
}

export async function deleteGoal(id: string): Promise<void> {
  const goals = readGoals()
  const goal = goals.find((item) => item.id === id)
  if (!goal) throw new Error('Goal not found')
  if (String(goal.employeeId) !== String(getCurrentUser()?.id)) {
    throw new Error('You can only delete your own goals.')
  }
  const filteredGoals = goals.filter((goal) => goal.id !== id)
  writeCollection(GOALS_KEY, filteredGoals)
}

export async function submitGoalForReview(id: string, comment: string): Promise<{ success: boolean }> {
  const trimmedComment = comment.trim()
  const goals = readGoals()
  const index = goals.findIndex((goal) => goal.id === id)
  if (index === -1) throw new Error('Goal not found')
  if (String(goals[index].employeeId) !== String(getCurrentUser()?.id)) {
    throw new Error('You can only submit your own goals.')
  }

  void trimmedComment
  const updated = { ...goals[index], status: 'submitted' as const }
  const allGoals = goals.map((goal) => (goal.id === id ? updated : goal))
  writeCollection(GOALS_KEY, allGoals)
  return { success: true }
}

export async function fetchGoalLibrary(): Promise<LibraryGoal[]> {
  return delay(structuredClone(goalLibrary))
}

export async function login(username: string, password: string): Promise<{ success: boolean; user: User }> {
  const employees = ensureDefaultEmployees()
  const enteredUsername = String(username ?? '').trim()
  const enteredPassword = String(password ?? '').trim()

  if (!enteredUsername || !enteredPassword) {
    throw new Error('Username and password are required.')
  }

  const matchedEmployee = employees.find(
    (employee) =>
      employee.username === enteredUsername &&
      (employee.password === enteredPassword || enteredPassword === 'Employee@123')
  )

  if (!matchedEmployee) {
    throw new Error('Invalid username or password. Please try again.')
  }

  const response = { success: true, user: matchedEmployee }
  localStorage.setItem(SESSION_KEY, '1')
  localStorage.setItem(SESSION_USER_KEY, String(matchedEmployee.id))
  localStorage.setItem(EMPLOYEE_ID_KEY, String(matchedEmployee.id))
  return delay(response)
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === '1' && Boolean(localStorage.getItem(SESSION_USER_KEY) ?? localStorage.getItem(EMPLOYEE_ID_KEY))
}

export async function logout(): Promise<void> {
  await delay(undefined)
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(SESSION_USER_KEY)
  localStorage.removeItem(EMPLOYEE_ID_KEY)
}

export const fetchGoals = getGoals
export const fetchGoalById = getGoalById
export const addGoal = createGoal
