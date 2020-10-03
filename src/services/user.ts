import User, { UserDocument } from '../models/User'

function create(user: UserDocument): Promise<UserDocument> {
  return user.save()
}

function findByEmail(email: string): Promise<UserDocument | null> {
  const user = User.findOne({ email: email }).exec()
  return user
}
/**
 * @param {*} username
 *
 * -This function find user that has the match username and return that user
 */
function findByUsername(username: string): Promise<UserDocument | null> {
  const user = User.findOne({ username: username }).exec()
  return user
}

async function findById(userId: string): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  return user
}
/**
 * Update user profile ( firsName, lastName, email )
 */
async function update(
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  if (update.firstName) {
    user.firstName = update.firstName
  }
  if (update.lastName) {
    user.lastName = update.lastName
  }
  if (update.email) {
    user.email = update.email
  }
  return user.save()
}

/**
 * Update user's password
 */
async function updatePassword(
  userId: string,
  newSalt: string,
  newHash: string
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  if (newSalt) {
    user.salt = newSalt
  }
  if (newHash) {
    user.hash = newHash
  }
  return user.save()
}

async function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

export default {
  create,
  findByEmail,
  findByUsername,
  findById,
  update,
  deleteUser,
  updatePassword,
}
