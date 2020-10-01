import express from 'express'

import {
  createProduct,
  findById,
  findAll,
  findByName,
  findByCategory,
  findByVariants,
  deleteProduct,
  updateProduct,
} from '../controllers/product'

const router = express.Router()

// Every path we define here will get /api/v1/products prefix
router.get('/', findAll)
router.get('/:productId', findById)
router.get('/findByName/:productName', findByName)
router.get('/findByCategory/:productCategory', findByCategory)
router.get('/findByVariants/:productVariants', findByVariants)
router.put('/:productId', updateProduct)
router.delete('/:productId', deleteProduct)
router.post('/', createProduct)

export default router
