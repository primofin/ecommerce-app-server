import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import { genPassword } from '../../src/helpers/password'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function registerUser(override?: Partial<UserDocument>) {
  const password = 'testabcd'
  const saltHash = genPassword(password)
  const salt = saltHash.salt
  const hash = saltHash.hash
  let user = {
    username: 'abcd',
    email: 'user1@gmail.com',
    firstName: 'Alex',
    lastName: 'Mitchel',
    hash: hash,
    salt: salt
  }
  if (override) {
    user = { ...user, ...override }
  }
  const res = await request(app).post('/api/v1/auth/register').send(user)
  console.log(res)
  return res
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('It should register a user', async () => {
    const res = await registerUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.username).toBe('user1')
  })

})
