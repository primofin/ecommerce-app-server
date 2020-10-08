import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Access denied')
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) 
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}
