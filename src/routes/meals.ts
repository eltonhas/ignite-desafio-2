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

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date_time: dateTime,
      diet,
      user_id: user.id,
    })

    reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const meals = await knex('meals')
      .where('user_id', user.id)
      .select('*')
      .orderBy('date_time', 'asc')

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies

    const { id } = getMealsParamsSchema.parse(request.params)

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const meal = await knex('meals').where({ id, user_id: user.id }).select('*')

    return { meal }
  })

  app.put('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string(),
      diet: z.enum(['true', 'false']),
    })

    const { sessionId } = request.cookies

    const { id } = getMealsParamsSchema.parse(request.params)

    const { name, description, dateTime, diet } = createMealBodySchema.parse(
      request.body,
    )

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const mealUpdate = await knex('meals')
      .where({ id, user_id: user.id })
      .update({
        name,
        description,
        date_time: dateTime,
        diet,
      })

    if (mealUpdate === 0) {
      return reply.status(401).send()
    }

    reply.status(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies

    const { id } = getMealsParamsSchema.parse(request.params)

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const mealDelete = await knex('meals')
      .where({ id, user_id: user.id })
      .delete()

    if (mealDelete === 0) {
      return reply.status(401).send()
    }

    reply.status(200).send()
  })
}
