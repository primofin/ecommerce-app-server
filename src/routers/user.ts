import express from 'express'

import {
  findById,
  updateUser,
  deleteUser,
  updateUserPassword,
} from '../controllers/user'

const router = express.Router()
/**
 * --------------GET ROUTES ----------------
 */
router.get('/:userId', findById)
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
