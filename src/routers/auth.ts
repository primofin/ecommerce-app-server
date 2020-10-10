import express from 'express'

import passport from '../config/passport'
import { postRegisterUser, postLoginUser, logout } from '../controllers/user'

const router = express.Router()
/**
 *
 * --------------POST ROUTES----------------
 *
 **/
router.post('/register', postRegisterUser)
router.post('/login', postLoginUser)
router.get('/logout', logout)
router.post('/emai-activate', postLoginUser)

router.get('/profile', (req, res) => {
  res.send('Profile')
})
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
  res.redirect('/api/v1/auth/profile')
  // res.send(req.user)
})

export default router
