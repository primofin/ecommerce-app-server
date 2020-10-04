import Product from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

async function createProduct() {
  const product = new Product({
    name: 'Dreamer Tee',
    description: 'Very comfortable',
    category: 'clothing',
    variants: ['red','leather'],
    sizes: ['large', 'medium', 'small'],
  })
  return await ProductService.create(product)
}

describe('product service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a product', async () => {
    const product = await createProduct()
    expect(product).toHaveProperty('_id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('category')
    expect(product).toHaveProperty('sizes')
  })

  it('should get a product with id', async () => {
    const product = await createProduct()
    const found = await ProductService.findById(product._id)
    expect(found.name).toEqual(product.name)
    expect(found._id).toEqual(product._id)
  })

  it('should not get a non-existing product', async () => {
    expect.assertions(1)
    return ProductService.findById(nonExistingProductId).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should update an existing product', async () => {
    const movie = await createProduct()
    const update = {
      name: 'Color Tee',
      description: 'Basic color tee',
    }
    const updated = await ProductService.update(movie._id, update)
    expect(updated).toHaveProperty('_id', movie._id)
    expect(updated).toHaveProperty('name', 'Color Tee')
    expect(updated).toHaveProperty('description', 'Basic color tee')
  })

  it('should not update a non-existing product', async () => {
    expect.assertions(1)
    const update = {
      name: 'Color Tee',
      description: 'Basic color tee',
    }
    return ProductService.update(nonExistingProductId, update).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should delete an existing product', async () => {
    expect.assertions(1)
    const product = await createProduct()
    await ProductService.deleteProduct(product._id)
    return ProductService.findById(product._id).catch((e) => {
      expect(e.message).toBe(`Product ${product._id} not found`)
    })
  })
})
