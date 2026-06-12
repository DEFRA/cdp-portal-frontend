import { test, expect } from 'vitest'
import {
  Resources,
  initBasket,
  updateBasketResource,
  removeBasketResource,
  getBasketResource,
  getBasketResourceList
} from './basket.js'

vi.mock('node:crypto', () => {
  return { default: { randomUUID: vi.fn(() => '123456789') } }
})

test('Creates initial basket', () => {
  expect(initBasket()).toEqual({
    s3_buckets: {},
    sns_topics: {},
    sqs_queues: {},
    sqs_sns_subscriptions: {}
  })
})

test('Gets a resource', () => {
  let basket = initBasket()

  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid', {
    name: 'test'
  })

  expect(getBasketResource(basket, Resources.s3Buckets, 'uuid')).toEqual({
    name: 'test'
  })
})

test('Gets a list of resources', () => {
  let basket = initBasket()

  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid', {
    name: 'test'
  })

  expect(getBasketResourceList(basket, Resources.s3Buckets)).toEqual([
    {
      name: 'test'
    }
  ])
})

test('Adds a resource', () => {
  let basket = initBasket()

  basket = updateBasketResource(basket, Resources.s3Buckets, undefined, {
    name: 'test'
  })

  expect(basket).toEqual({
    s3_buckets: {
      123456789: { name: 'test' }
    },
    sns_topics: {},
    sqs_queues: {},
    sqs_sns_subscriptions: {}
  })
})

test('Updates a resource', () => {
  let basket = initBasket()

  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid', {
    name: 'test'
  })

  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid', {
    name: '123'
  })

  expect(basket).toEqual({
    s3_buckets: {
      uuid: { name: '123' }
    },
    sns_topics: {},
    sqs_queues: {},
    sqs_sns_subscriptions: {}
  })
})

test('Removes a resource', () => {
  let basket = initBasket()

  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid', {
    name: 'test'
  })
  basket = updateBasketResource(basket, Resources.s3Buckets, 'uuid2', {
    name: '123'
  })

  basket = removeBasketResource(basket, Resources.s3Buckets, 'uuid')

  expect(basket).toEqual({
    s3_buckets: {
      uuid2: { name: '123' }
    },
    sns_topics: {},
    sqs_queues: {},
    sqs_sns_subscriptions: {}
  })
})
