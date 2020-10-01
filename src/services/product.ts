import Product, { ProductDocument } from '../models/Product'

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

async function findById(productId: string): Promise<ProductDocument> {
  const product = await Product.findById(productId).exec()
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }
  return product
}

function findAll(): Promise<ProductDocument[]> {
  return Product.find().sort({ name: 1 }).exec() // Return a Promise
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
  if (update.description) {
    product.description = update.description
  }
  if (update.category) {
    product.category = update.category
  }
  if (update.variants) {
    product.variants = update.variants
  }
  if (update.sizes) {
    product.sizes = update.sizes
  }
  return product.save()
}
export default {
  create,
  findById,
  findAll,
  deleteProduct,
  update,
}
