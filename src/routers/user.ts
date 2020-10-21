import express from 'express'

import {
  findById,
  updateUser,
  deleteUser,
  updateUserPassword,
  addProductToCart,
  removeProductFromCart,
  getUserWithItemsInCart,
  decreaseProductQuantityFromCart,
} from '../controllers/user'

const router = express.Router()
/**
 * --------------GET ROUTES ----------------
 */
router.get('/:userId', findById)
router.get('/itemsInCart/:userId', getUserWithItemsInCart)
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
router.patch(
  '/decreaseProductQuantityFromCart/:userId',
  decreaseProductQuantityFromCart
)
router.patch('/:userId', updateUser)
router.patch('/change-password/:userId', updateUserPassword)
export default router
