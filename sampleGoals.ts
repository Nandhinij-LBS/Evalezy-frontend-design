import type { Employee, Goal, LibraryGoal, User } from '../types'

export const defaultEmployees: Employee[] = [
  {
    id: 1,
    name: 'Employee 1',
    username: 'employee01',
    password: 'password01',
    goal: 'Complete assigned goals',
    role: 'Employee',
    email: 'employee01@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 2,
    name: 'Employee 2',
    username: 'employee02',
    password: 'password02',
    goal: 'Improve team communication',
    role: 'Employee',
    email: 'employee02@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 3,
    name: 'Employee 3',
    username: 'employee03',
    password: 'password03',
    goal: 'Deliver measurable project milestones',
    role: 'Employee',
    email: 'employee03@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 4,
    name: 'Employee 4',
    username: 'employee04',
    password: 'password04',
    goal: 'Enhance customer experience quality',
    role: 'Employee',
    email: 'employee04@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 5,
    name: 'Employee 5',
    username: 'employee05',
    password: 'password05',
    goal: 'Complete assigned goals',
    role: 'Employee',
    email: 'employee05@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 6,
    name: 'Employee 6',
    username: 'employee06',
    password: 'password06',
    goal: 'Drive process improvements',
    role: 'Employee',
    email: 'employee06@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 7,
    name: 'Employee 7',
    username: 'employee07',
    password: 'password07',
    goal: 'Build stronger collaboration habits',
    role: 'Employee',
    email: 'employee07@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 8,
    name: 'Employee 8',
    username: 'employee08',
    password: 'password08',
    goal: 'Support operational efficiency',
    role: 'Employee',
    email: 'employee08@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 9,
    name: 'Employee 9',
    username: 'employee09',
    password: 'password09',
    goal: 'Expand analytics and reporting',
    role: 'Employee',
    email: 'employee09@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
  {
    id: 10,
    name: 'Employee 10',
    username: 'employee10',
    password: 'password10',
    goal: 'Complete assigned goals',
    role: 'Employee',
    email: 'employee10@evalezy.com',
    avatarUrl: '/icons/Avatar.png',
  },
]

export const sampleUsers: User[] = defaultEmployees
export const currentUser = sampleUsers[0]

const defaultGoalDetails = [
  ['Improve Customer Service Quality', 'Improve customer communication and resolve customer issues effectively.', 'Functional', 25, 'Respond to customer requests within the expected SLA.', 'Resolve assigned customer issues accurately and consistently.', 'Identify recurring issues and propose improvements to reduce resolution time.', ['Complete customer-service training', 'Maintain SLA compliance', 'Achieve positive customer feedback']],
  ['Increase Sales Performance', 'Improve sales performance by increasing customer engagement and achieving revenue targets.', 'Business', 20, 'Achieve at least 70% of the assigned sales target.', 'Achieve 100% of the assigned sales target.', 'Exceed the sales target by 20% and acquire new customers.', ['Complete product training', 'Contact assigned prospects', 'Achieve monthly sales targets']],
  ['Improve Team Productivity', 'Improve team productivity through better planning, collaboration, and task management.', 'Functional', 15, 'Complete assigned tasks within agreed timelines.', 'Consistently complete tasks on time with minimal follow-up.', 'Introduce a process improvement that increases team productivity.', ['Create weekly task plans', 'Track task completion', 'Implement productivity improvements']],
  ['Enhance Software Quality', 'Improve application quality by reducing defects and strengthening testing practices.', 'Technical', 20, 'Complete testing for assigned features.', 'Deliver features with minimal production defects.', 'Introduce automated testing or a quality improvement process.', ['Prepare test cases', 'Complete regression testing', 'Reduce recurring defects']],
  ['Improve Project Delivery', 'Deliver projects efficiently by following timelines and coordinating effectively with stakeholders.', 'Project Management', 20, 'Complete project tasks according to the planned schedule.', 'Deliver assigned projects within the agreed timeline and scope.', 'Deliver projects ahead of schedule while maintaining quality.', ['Prepare project plan', 'Complete key project activities', 'Conduct project review']],
  ['Strengthen Employee Communication', 'Improve workplace communication through clear updates and effective collaboration.', 'Behavioral', 10, 'Provide timely updates on assigned activities.', 'Maintain clear and consistent communication with team members.', 'Introduce communication practices that improve team collaboration.', ['Attend communication training', 'Provide regular status updates', 'Conduct knowledge-sharing sessions']],
  ['Reduce Operational Errors', 'Reduce errors in daily operations by improving processes, reviews, and documentation.', 'Operational', 15, 'Follow defined operational procedures consistently.', 'Reduce operational errors and maintain accurate records.', 'Identify root causes and implement improvements to prevent recurring errors.', ['Review operational procedures', 'Maintain accurate records', 'Analyze recurring errors']],
  ['Improve Employee Skill Development', 'Develop professional and technical skills through continuous learning and practical application.', 'Development', 10, 'Complete required learning programs.', 'Apply newly acquired skills effectively in daily work.', 'Complete advanced training and share knowledge with team members.', ['Complete required courses', 'Practice new skills', 'Conduct knowledge-sharing sessions']],
  ['Improve Process Efficiency', 'Identify and implement improvements that reduce manual effort and improve work efficiency.', 'Process Improvement', 15, 'Identify opportunities to improve existing processes.', 'Implement process improvements that reduce manual effort.', 'Automate key processes and achieve measurable efficiency gains.', ['Identify process gaps', 'Document improvement opportunities', 'Implement process automation']],
  ['Enhance Customer Satisfaction', 'Improve customer satisfaction by providing timely support and resolving issues effectively.', 'Customer Service', 20, 'Respond to customer queries within the defined SLA.', 'Resolve customer concerns accurately and maintain positive feedback.', 'Achieve consistently high customer satisfaction and introduce improvements based on feedback.', ['Monitor customer feedback', 'Maintain SLA compliance', 'Implement feedback-based improvements']],
] as const

// Each employee is assigned ONE distinct goal:
// Employee 1 -> goal 1, Employee 2 -> goal 2, ... Employee 10 -> goal 10.
export const defaultEmployeeGoals: Goal[] = defaultEmployees.map((employee, employeeIndex) => {
  const goalIndex = employeeIndex % defaultGoalDetails.length
  const [
    title,
    description,
    category,
    weightPercent,
    threshold50,
    target100,
    superior150,
    milestoneTexts,
  ] = defaultGoalDetails[goalIndex]

  return {
    id: `employee-${employee.id}-goal-${goalIndex+1}`,
    employeeId: String(employee.id),
    title,
    description,
    category,
    weightPercent,
    dueDate: '2026-12-31',
    status: 'not-started',
    threshold50,
    target100,
    superior150,
    milestones: milestoneTexts.map((text, milestoneIndex) => ({
      id: `employee-${employee.id}-goal-${goalIndex + 1}-milestone-${milestoneIndex + 1}`,
      text,
      done: false,
    })),
  }
})

export const sampleGoals: Goal[] = defaultEmployeeGoals

// Pre-built goal templates shown in the "Goal Library" picker.
export const goalLibrary: LibraryGoal[] = [
  {
    id: 'l1',
    title: 'Improve Communication Skills',
    category: 'Functional',
    description: 'Enhance team reporting and client updates.',
  },
  {
    id: 'l2',
    title: 'Increase Revenue by 15%',
    category: 'Functional',
    description: 'Drive organic sales and conversion rates by improving lead quality and optimizing conversion funnels.',
  },
  {
    id: 'l3',
    title: 'Reduce Operational Costs',
    category: 'Functional',
    description: 'Optimize software subscriptions and vendor contracts.',
  },
  {
    id: 'l4',
    title: 'Enhance Team Collaboration',
    category: 'Functional',
    description: 'Implement agile workflows and review cadences.',
  },
]