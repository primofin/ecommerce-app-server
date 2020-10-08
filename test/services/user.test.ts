import User from '../../src/models/User'
import UserService from '../../src/services/user'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    username: 'dummyusername',
    email: 'abc@gmail.com',
    firstName: 'abc',
    lastName: 'xyz',
    password: 'dummypass',
  })
  return await UserService.create(user)
}

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })
  it('It should create a user', async () => {
    const user = await createUser()
    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('firstName')
    expect(user).toHaveProperty('password')
  })

  it('It should get a user with email', async () => {
    const user = await createUser()
    const found = await UserService.findByEmail(user.email)
    if (found) {
      expect(found.email).toEqual(user.email)
      expect(found._id).toEqual(user._id)
    }
  })

  it('It should get a user with username', async () => {
    const user = await createUser()
    const found = await UserService.findByUsername(user.username)
    if (found) {
      expect(found.username).toEqual(user.username)
      expect(found._id).toEqual(user._id)
    }
  })

  it('It should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    if (found) {
      expect(found.username).toEqual(user.username)
      expect(found._id).toEqual(user._id)
    }
  })

  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('It should update a user', async () => {
    const user = await createUser()
    const update = {
      firstName: 'newFirstName',
      lastName: 'lastName',
      email: 'asdf@gmail.com',
    }
    const updated = await UserService.update(user._id, update)
    expect(updated.firstName).toEqual('newFirstName')
    expect(updated.lastName).toEqual('lastName')
    expect(updated.email).toEqual('asdf@gmail.com')
  })

  it('It should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'newFirstName',
      lastName: 'lastName',
      email: 'asdf@gmail.com',
    }
    return UserService.update(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })
})
