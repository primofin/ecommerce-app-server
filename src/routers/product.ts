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
} from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAll)
router.get('/:productId', findById)
router.get('/findByName/:productName', findByName)
router.get('/findByCategory/:productCategory', findByCategory)
router.get('/findByVariant/:productVariants', findByVariant)
router.delete('/:productId', deleteProduct)

/******************************************
 * ------------ROLE: ADMIN------------------
 *******************************************/
router.post('/',[verifyToken,checkPermission], createProduct)
router.put('/:productId',[verifyToken,checkPermission], updateProduct)

export default router
