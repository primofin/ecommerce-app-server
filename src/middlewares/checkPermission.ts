import { Request, Response, NextFunction } from 'express'

import UserService from '../services/User'
type ReqUser = {
  userId: string;
  iat: string;
  exp: string;
}
export async function checkPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqUser = req.user as ReqUser
  const reqUserId = reqUser.userId
  const user = await UserService.findById(reqUserId)
  if (user.isAdmin) {
    next()
    return
  }
  res.status(401).send('Access denied')
}
