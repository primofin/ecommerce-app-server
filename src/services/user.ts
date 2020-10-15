import bcrypt from 'bcrypt'

import User, { UserDocument } from '../models/User'
import Product, { ProductDocument } from '../models/Product'

async function create(user: UserDocument): Promise<UserDocument> {
  return await user.save()
}

async function findByEmail(email: string): Promise<UserDocument | null> {
  const user = await User.findOne({ email: email }).exec()
  return user
}
/**
 * @param {*} username
 *
 * -This function find user that has the match username and return that user
 */
async function findByUsername(username: string): Promise<UserDocument | null> {
  const user = await User.findOne({ username: username }).exec()
  return user
}

async function findById(userId: string): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  return user
}

async function resetPassword(
  userId: string,
  password: string
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  if (password) {
    user.password = password
  }
  return user.save()
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
  newPassword: string
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10)
  }
  return user.save()
}

async function deleteUser(userId: string): Promise<UserDocument | null> {
  return User.findByIdAndDelete(userId).exec()
}

async function addProductToCart(
  userId: string,
  productId: string
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  user.itemsInCart.push(product._id)
  return user.save()
}

async function removeProductFromCart(
  userId: string,
  productId: string
): Promise<UserDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  const index = user.itemsInCart.indexOf(productId)
  user.itemsInCart.splice(index, 1)
  return user.save()
}

export default {
  create,
  findByEmail,
  findByUsername,
  findById,
  update,
  deleteUser,
  updatePassword,
  resetPassword,
  addProductToCart,
  removeProductFromCart,
}
