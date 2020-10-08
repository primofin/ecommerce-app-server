import { Request, Response, NextFunction } from 'express'

import UserService from '../services/User'

export async function checkPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await UserService.findById(req.body.userId)
  if (user.isAdmin) {
    next()
    return
  }
  res.status(401).send('Access denied')
}
