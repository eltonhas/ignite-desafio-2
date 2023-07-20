import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    checkSessionIdExists(request, reply)
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string(),
      diet: z.enum(['true', 'false']),
    })

    const { name, description, dateTime, diet } = createMealBodySchema.parse(
      request.body,
    )

    const { sessionId } = request.cookies

    const user = await knex('users').select('*').where('id', sessionId)

    if (user.length === 0) {
      return reply.status(400).send()
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date_time: dateTime,
      diet,
      user_id: sessionId,
    })

    reply.status(201).send()
  })
}
