import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id'
import { knex } from '../database'
import { bigSequence } from '../lib/big-sequence'

export const summaryRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    checkSessionIdExists(request, reply)
  })

  app.get('/totalMeals', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const totalMeals = await knex('meals')
      .where('user_id', user.id)
      .count('id', { as: 'totalMeals' })

    return { totalMeals }
  })

  app.get('/totalMealsDiet', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const totalMealsDiet = await knex('meals')
      .where({
        diet: 'true',
        user_id: user.id,
      })
      .count('id', { as: 'onDiet' })

    return { totalMealsDiet }
  })

  app.get('/totalMealsNotDiet', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const totalMealsNotDiet = await knex('meals')
      .where({
        diet: 'false',
        user_id: user.id,
      })
      .count('id', { as: 'notDiet' })

    return { totalMealsNotDiet }
  })

  app.get('/dietSequence', async (request, reply) => {
    const { sessionId } = request.cookies

    const user = await knex('users').where('id', sessionId).select('*').first()

    if (!user) {
      return reply.status(400).send()
    }

    const meals = await knex('meals')
      .where({
        user_id: user.id,
      })
      .select('*')
      .orderBy('date_time', 'asc')

    const dietSequence = bigSequence(meals)

    return { dietSequence }
  })
}
