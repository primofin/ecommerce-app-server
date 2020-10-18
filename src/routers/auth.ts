import express from 'express'

import passport from '../config/passport'

import {
  postRegisterUser,
  postLoginUser,
  logout,
  checkAuthentication,
} from '../controllers/user'
import { recover, resetPassword } from '../controllers/userPassword'
import { verifyToken } from '../middlewares/verifyToken'

const router = express.Router()
// Every path we define here will get /api/v1/auth prefix
/**
 *
 * --------------POST ROUTES----------------
 *
 **/
router.post('/register', postRegisterUser)
router.post('/login', postLoginUser)
router.get('/logout', logout)
router.post('/forgot-password', recover)
router.post('/reset-password/:token', resetPassword)

/**
 *
 * --------------GET ROUTES----------------
 *
 **/
router.get('/isAuthenticated', verifyToken, checkAuthentication)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/api/v1/auth/profile')
})

router.get('/profile', (req, res) => {
  res.send('Profile')
})
export default router
