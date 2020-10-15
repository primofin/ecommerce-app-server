import express from 'express'

import {
  findById,
  updateUser,
  deleteUser,
  updateUserPassword,
  addProductToCart,
  removeProductFromCart,
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
router.patch('/addToCart/:userId', addProductToCart)
router.patch('/removeFromCart/:userId', removeProductFromCart)
router.patch('/:userId', updateUser)
router.patch('/change-password/:userId', updateUserPassword)
export default router
