import { Request, Response, NextFunction } from 'express'

import passport from '../config/passport'
import { genPassword, validPassword } from '../helpers/password'
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
    if (isEmailExist) {
      next(new InternalServerError('Email already in use'))
    }
    const isUsernameExist = await UserService.findByUsername(username)
    if (isUsernameExist) {
      next(new InternalServerError('Username already in use'))
    }
    const saltHash = genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash
    const user = new User({
      username,
      firstName,
      lastName,
      hash: hash,
      salt: salt,
      email,
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
      const isPasswordMatch = validPassword(password, user.hash, user.salt)
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
      const isPasswordMatch = validPassword(oldPassword, user.hash, user.salt)
      if (isPasswordMatch) {
        const newSaltHash = genPassword(newPassword)
        const newSalt = newSaltHash.salt
        const newHash = newSaltHash.hash
        await UserService.updatePassword(userId, newSalt, newHash)
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
