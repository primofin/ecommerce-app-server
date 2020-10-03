import express from 'express'

import { updateUser, deleteUser, updateUserPassword } from '../controllers/user'

const router = express.Router()
/**
 * --------------DELETE ROUTES ----------------
 */
router.delete('/:userId', deleteUser)
/**
 * --------------PATCH ROUTES ----------------
 */
router.patch('/:userId', updateUser)
router.patch('/change-password/:userId', updateUserPassword)
export default router
