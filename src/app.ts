import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { summaryRoutes } from './routes/summary'

export const app = fastify()

app.register(cookie)
app.register(usersRoutes)
app.register(mealsRoutes, { prefix: 'meals' })
app.register(summaryRoutes, { prefix: 'summary' })
