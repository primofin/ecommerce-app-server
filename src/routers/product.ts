import express from 'express'
import { checkPermission } from '../middlewares/checkPermission'
import { verifyToken } from '../middlewares/verifyToken'

import {
  createProduct,
  findById,
  findAll,
  findByName,
  findByCategory,
  findByVariant,
  deleteProduct,
  updateProduct,
  orderProduct,
  unorderProduct,
} from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAll)
router.get('/:productId', findById)
router.get('/findByName/:productName', findByName)
router.get('/findByCategory/:productCategory', findByCategory)
router.get('/findByVariant/:productVariants', findByVariant)
router.patch('/order/:productId', orderProduct)
router.patch('/unorder/:productId', unorderProduct)
router.delete('/:productId', deleteProduct)

/******************************************
 * ------------ROLE: ADMIN------------------
 *******************************************/
router.post('/', [verifyToken, checkPermission], createProduct)
router.patch('/:productId', [verifyToken, checkPermission], updateProduct)
router.patch('/order/:productId', orderProduct)

export default router
