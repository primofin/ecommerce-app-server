import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

export async function registerUser(override?: Partial<UserDocument>) {
  let user = {
    username: 'dummyusername',
    firstName: 'Alex',
    lastName: 'Mitchel',
    email: 'user1@gmail.com',
    password: '1234aaaa',
    isAdmin: true,
  }
  if (override) {
    user = { ...user, ...override }
  }
  const res = await request(app).post('/api/v1/auth/register').send(user)
  return res
}

export async function login(override?: Partial<UserDocument>) {
  let user = {
    username: 'dummyusername',
    firstName: 'Alex',
    lastName: 'Mitchel',
    email: 'user1@gmail.com',
    password: '1234aaaa',
    isAdmin: true,
  }
  if (override) {
    user = { ...user, ...override }
  }
  await request(app).post('/api/v1/auth/register').send(user)
  const res = await request(app).post('/api/v1/auth/login').send(user)
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
    expect(res.body.username).toBe('dummyusername')
  })
  it('It should not create a user with wrong data', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'dummyname',
      password: '12345pass',
    })
    expect(res.status).toBe(400)
  })

  it('It should log the user in', async () => {
    const res = await login()
    expect(res.status).toBe(200)
  })

  it('It should update a user', async () => {
    let res = await registerUser()
    expect(res.status).toBe(200)
    const userId = res.body._id
    const update = {
      firstName: 'vy',
      email: 'abcd@gmail.com',
    }
    res = await request(app).patch(`/api/v1/users/${userId}`).send(update)
    expect(res.status).toEqual(200)
    expect(res.body.firstName).toEqual('vy')
    expect(res.body.email).toEqual('abcd@gmail.com')
  })

  it('It should not update a user with wrong id', async () => {
    const update = {
      firstName: 'vy',
      email: 'abcd@gmail.com',
    }
    const res = await request(app)
      .patch(`/api/v1/users/${nonExistingUserId}`)
      .send(update)
    expect(res.status).toEqual(404)
  })

  it('It should update a user\'s password', async () => {
    let res = await registerUser()
    expect(res.status).toBe(200)
    const update = {
      oldPassword: '1234',
      newPassword: '123abc'
    }
    const userId = res.body._id
    res = await request(app).patch(`/api/v1/users/change-password/${userId}`).send(update)
    expect(res.status).toBe(204)
  })

  it('It should delete a user', async () => {
    let res = await registerUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).delete(`/api/v1/users/${userId}`)
    expect(res.status).toBe(204)
  })
})
