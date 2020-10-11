import express from 'express'

import passport from '../config/passport'
import { postRegisterUser, postLoginUser, logout } from '../controllers/user'
import { recover, resetPassword } from '../controllers/userPassword'

const router = express.Router()
/**
 *
 * --------------POST ROUTES----------------
 *
 **/
router.post('/register', postRegisterUser)
router.post('/login', postLoginUser)
router.get('/logout', logout)
// router.post('/emai-activate', postLoginUser)
router.post('/forgot-password', recover)
router.post('/reset-password/:token', resetPassword)

/**
 *
 * --------------GET ROUTES----------------
 *
 **/
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  // res.send(req.user)
  res.redirect('/api/v1/auth/profile')
})

router.get('/profile', (req, res) => {
  res.send('Profile')
})
export default router
