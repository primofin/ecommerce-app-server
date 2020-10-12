import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserService from '../services/user'
import { InternalServerError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'
import sendEmail from '../util/sendEmail'

type Decoded = {
  userId: string;
  iat: string;
  exp: string;
}
export const recover = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body
    const user = await UserService.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        message:
          'The email address ' + email + ' is not associated with any account',
      })
    }
    //generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: 3600, // expires in 1 hour
    })
    const link = `${req.protocol}://localhost:3000/api/v1/auth/reset-password/${token}`
    await sendEmail(
      email,
      'Password reset',
      `
        <div>Click the link below to reset your password</div><br/>
        <div>${link}</div>
        `
    )
    return res.status(200).send({
      message: 'Password reset link has been successfully sent to your inbox',
    })
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body
    const { token } = req.params
    const verifyToken = (token: string) => {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    }
    const decoded = verifyToken(token) as Decoded
    const userId = decoded.userId
    const hash = bcrypt.hashSync(password, 10)
    await UserService.resetPassword(userId, hash)
    res.send(200)
  } catch (e) {
    return next(new Error(e))
  }
}
