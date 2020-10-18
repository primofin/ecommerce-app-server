import request from 'supertest'
import cookie from 'cookie'

import { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import { login } from './user.test'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

async function createProduct(override?: Partial<ProductDocument>) {
  const res = await login()
  const token = cookie.parse(res.header['set-cookie'][0]).authcookie
  let product = {
    name: 'Dreamer Tee',
    price: 234,
    images: ['https://i.ibb.co/BqVTKMj/Ray.jpg'],
    description: 'Very comfortable',
    category: 'clothing',
    variants: ['red', 'leather'],
    // sizes: ['large', 'medium', 'small'] as string[] | number[],
    size: 'large' as string | number,
  }
  if (override) {
    product = { ...product, ...override }
  }
  return await request(app)
    .post('/api/v1/products')
    .set('Cookie', [`authcookie=${token}`])
    .send(product)
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
    const loginRes = await login()
    const headerToken = cookie.parse(loginRes.header['set-cookie'][0])
      .authcookie
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Dreamer Tee',
        description: 'Very comfortable',
        // category: 'clothing',
        variants: ['red', 'leather'],
        size: 'large' as string | number,
      })
      .set('Cookie', [`authcookie=${headerToken}`])
    expect(res.status).toBe(400)
  })
  it('should get back an existing product by productId', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app).get(`/api/v1/products/${productId}`)

    expect(res.body._id).toEqual(productId)
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app).get(
      `/api/v1/products/${nonExistingProductId}`
    )
    expect(res.status).toBe(404)
  })
  it('should get back all products', async () => {
    const res1 = await createProduct({
      name: 'Dreamer Tee 1',
      category: 'clothing',
      size: 'large' as string | number,
    })
    const res2 = await createProduct({
      name: 'Dreamer Tee 2',
      description: 'Very comfortable',
      category: 'clothing',
      size: 'large' as string | number,
    })

    const res3 = await request(app).get('/api/v1/products')
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('It should get back a product by its variant', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    const variants = res.body.variants
    const variant = res.body.variants[0]
    res = await request(app).get(`/api/v1/products/findByVariant/${variant}`)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          variants: variants,
        }),
      ])
    )
  })

  it('It should get back a product by category', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    const category = res.body.category
    res = await request(app).get(`/api/v1/products/findByCategory/${category}`)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: category,
        }),
      ])
    )
  })

  it('should update an existing product', async () => {
    const loginRes = await login()
    const headerToken = cookie.parse(loginRes.header['set-cookie'][0])
      .authcookie
    let res = await createProduct()
    expect(res.status).toBe(200)
    const productId = res.body._id
    const update = {
      name: 'Basic tee',
      variants: ['cottons'],
    }
    res = await request(app)
      .patch(`/api/v1/products/${productId}`)
      .set('Cookie', [`authcookie=${headerToken}`])
      .send(update)
    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('Basic tee')
    expect(res.body.variants).toEqual(['cottons'])
  })

  it('should not update a non-existing product', async () => {
    const loginRes = await login()
    const headerToken = cookie.parse(loginRes.header['set-cookie'][0])
      .authcookie
    const update = {
      name: 'Basic tee',
      variants: ['cottons'],
    }
    const res = await request(app)
      .put(`/api/v1/products/${nonExistingProductId}`)
      .set('Cookie', [`authcookie=${headerToken}`])
      .send(update)
    expect(res.status).toEqual(404)
  })
  it('should delete an existing product', async () => {
    const loginResponse = await login()
    const token = cookie.parse(loginResponse.header['set-cookie'][0]).authcookie
    let res = await createProduct()
    expect(res.status).toBe(200)
    const productId = res.body._id
    res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Cookie', [`authcookie=${token}`])
    expect(res.status).toEqual(200)
    res = await request(app).get(`/api/v1/products/${productId}`)
    expect(res.status).toBe(404)
  })
})
