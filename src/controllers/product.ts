import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, category, variants, sizes } = req.body
    const product = new Product({
      name,
      description,
      category,
      variants,
      sizes,
    })
    await ProductService.create(product)
    res.json(product)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findAll())
  } catch (error) {
    next(new NotFoundError('Products not found', error))
  }
}
// GET /product/:productId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findById(req.params.productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
// GET /product/:productName
export const findByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findByName(req.params.productName))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
// GET /product/:productCategory
export const findByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findByCategory(req.params.productCategory))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /product/:productVariants
export const findByVariant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findByVariant(req.params.productVariants))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// DELETE /products/:productId
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
// UPDATE /products/:productId
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const productId = req.params.productId
    const updatedProduct = await ProductService.update(productId, update)
    res.json(updatedProduct)
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// UPDATE /products/order/:productId
export const orderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body
    const productId = req.params.productId
    const updatedProduct = await ProductService.orderProduct(userId, productId)
    res.json(updatedProduct)
  } catch (error) {
    console.log(error)
    next(new NotFoundError('Product not found', error))
  }
}

// UPDATE /products/unorder/:productId
export const unorderProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body
    const productId = req.params.productId
    const updatedProduct = await ProductService.unorderProduct(
      userId,
      productId
    )
    res.json(updatedProduct)
  } catch (error) {
    console.log(error)
    next(new NotFoundError('Product not found', error))
  }
}
