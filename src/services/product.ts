import Product, { ProductDocument } from '../models/Product'
import User from '../models/User'

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise
}

// find product by ID
async function findById(productId: string): Promise<ProductDocument> {
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  return product
}

// find product by name
async function findByName(productName: string): Promise<ProductDocument[]> {
  const product = await Product.find({ name: productName }).exec()
  if (!product) {
    throw new Error(`Product ${productName} not found`)
  }
  return product
}

// find product by Category
async function findByCategory(
  productCategory: string
): Promise<ProductDocument[]> {
  const product = await Product.find({ category: productCategory }).exec()
  if (!product) {
    throw new Error(`Product in ${productCategory} not found`)
  }
  return product
}
// find product by Variants
async function findByVariant(variant: string): Promise<ProductDocument[]> {
  const product = await Product.find({ variants: variant }).exec()
  if (!product) {
    throw new Error(`Product with ${variant} not found`)
  }
  return product
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

async function update(
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument> {
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  if (update.name) {
    product.name = update.name
  }
  if (update.price) {
    product.price = update.price
  }
  if (update.description) {
    product.description = update.description
  }
  if (update.category) {
    product.category = update.category
  }
  if (update.variants) {
    product.variants = update.variants
  }
  if (update.size) {
    product.size = update.size
  }
  return product.save()
}

async function orderProduct(
  userId: string,
  productId: string
): Promise<ProductDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  product.orderBy = user
  return product.save()
}

async function unorderProduct(
  userId: string,
  productId: string
): Promise<ProductDocument> {
  const user = await User.findById(userId).exec()
  if (!user) {
    throw new Error(`User ${userId} not found`)
  }
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  product.orderBy = null
  return product.save()
}

export default {
  create,
  findById,
  findAll,
  findByName,
  findByCategory,
  findByVariant,
  deleteProduct,
  update,
  orderProduct,
  unorderProduct,
}
