import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../util/secrets'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Access denied')
  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}
