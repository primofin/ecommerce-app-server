import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

/**
 * POST /users
 */
export const postRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      isBan,
      isAdmin,
    } = req.body
    const isEmailExist = await UserService.findByEmail(email)
    // throw error when email already registered
    if (isEmailExist)
      return res.status(400).json({ error: 'Email already exists' })
    const isUsernamelExist = await UserService.findByUsername(username)
    // throw error when email already registered
    if (isUsernamelExist)
      return res.status(400).json({ error: 'Username already exists' })
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin,
      isBan,
    })
    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

export const postLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body
    const user = await UserService.findByUsername(username)
    if (user) {
      const isPasswordMatch = bcrypt.compare(password, user.password)
      if (isPasswordMatch) {
        res.status(200).send('Successfully logged in')
      } else {
        next(new BadRequestError('Password is incorrect'))
      }
    } else {
      next(new NotFoundError('Username is not exist'))
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

/**
 *  PATCH /users/:userId
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updateUser = await UserService.update(userId, update)
    res.json(updateUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

/**
 *  PATCH /change-password/:userId
 */
export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body
    const userId = req.params.userId
    const user = await User.findById(userId).exec()
    if (user) {
      const isPasswordMatch = bcrypt.compare(oldPassword, user.password)
      if (isPasswordMatch) {
        await UserService.updatePassword(userId, newPassword)
        res.status(204).end()
      } else {
        throw new Error('The old password you have entered is incorrect')
      }
    }
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

/**
 * DELETE /users/:userId
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params)
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
