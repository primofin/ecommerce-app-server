import express from 'express'

import { postRegisterUser, postLoginUser, logout } from '../controllers/user'

const router = express.Router()

/**
 * --------------POST ROUTES ----------------
 */
router.post('/register', postRegisterUser)
router.post('/login', postLoginUser)
router.post('/logout', logout)
router.post('/emai-activate', postLoginUser)

export default router
