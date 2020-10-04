import request from 'supertest'

import { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingMovieId = '5e57b77b5744fa0b461c7906'

async function createProduct(override?: Partial<ProductDocument>) {
  let product = {
    name: 'Dreamer Tee',
    description: 'Very comfortable',
    category: 'clothing',
    variants: ['red', 'leather'],
    sizes: ['large', 'medium', 'small'],
  }
  if (override) {
    product = { ...product, ...override }
  }
  return await request(app).post('/api/v1/products').send(product)
}

describe('product controller', () => {
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
    const res = await createProduct()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Dreamer Tee')
  })

  it('should not create a product with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Dreamer Tee',
        description: 'Very comfortable',
        // category: 'clothing',
        variants: ['red', 'leather'],
        sizes: ['large', 'medium', 'small'],
      })
    expect(res.status).toBe(400)
  })
  it('should get back an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app).get(`/api/v1/products/${productId}`)

    expect(res.body._id).toEqual(productId)
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app).get(`/api/v1/products/${nonExistingMovieId}`)
    expect(res.status).toBe(404)
  })

})
