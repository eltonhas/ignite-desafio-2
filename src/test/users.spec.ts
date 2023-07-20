import { execSync } from 'node:child_process'

import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import request from 'supertest'

import { app } from '../app'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should to be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({ name: 'Elton Hugo', username: 'eltonhugo' })
      .expect(201)
  })
})

describe('Meal routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should to be able to create a new meal', async () => {
    const createNewUser = await request(app.server)
      .post('/users')
      .send({ name: 'Elton Hugo', username: 'eltonhugo' })

    const cookies = createNewUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'chocolate',
        description: 'chocolate ao leite',
        date_time: '2023-07-20 12:54:00',
        diet: 'false',
      })
      .expect(201)
  })
})
