import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sampleGoals } from './src/data/sampleGoals'
import type { Goal } from './src/types'

function createGoalApi() {
  let goals: Goal[] = JSON.parse(JSON.stringify(sampleGoals)) as Goal[]

  return {
    name: 'evalezy-goal-api',
    configureServer(server: { middlewares: { use: (handler: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/goals(?:\/([^/?]+))?$/)
        const isDocumentNavigation = req.headers.accept?.includes('text/html')
        if (!match || (req.method === 'GET' && isDocumentNavigation)) {
          next()
          return
        }

        const goalId = match[1]
        if (req.method === 'GET') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(goalId ? goals.find((goal) => goal.id === goalId) : goals))
          return
        }

        let body = ''
        req.setEncoding('utf8')
        req.on('data', (chunk: string) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const data = JSON.parse(body) as Record<string, unknown>
            if (req.method === 'POST') {
              if (typeof data.title !== 'string' || data.title.trim() === '') {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Goal title is required' }))
                return
              }

              const goal = {
                ...data,
                id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              } as unknown as Goal
              goals = [...goals, goal]
              res.statusCode = 201
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(goal))
              return
            }

            if (!goalId) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ message: 'Goal id is required' }))
              return
            }

            if (req.method === 'PUT') {
              const existing = goals.find((goal) => goal.id === goalId)
              if (!existing) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Goal not found' }))
                return
              }
              const updated = { ...existing, ...data, id: goalId } as Goal
              goals = goals.map((goal) => (goal.id === goalId ? updated : goal))
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(updated))
              return
            }

            if (req.method === 'PATCH') {
              const updated = goals.map((goal) => (goal.id === goalId ? { ...goal, ...data, id: goalId } : goal))
              goals = updated
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(updated.find((goal) => goal.id === goalId)))
              return
            }

            if (req.method === 'DELETE') {
              goals = goals.filter((goal) => goal.id !== goalId)
              res.statusCode = 204
              res.end()
              return
            }

            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Method not allowed' }))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [createGoalApi(), react(), tailwindcss()],
})
