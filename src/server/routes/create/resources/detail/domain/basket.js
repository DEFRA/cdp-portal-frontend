import { randomUUID } from 'node:crypto'

export const Resources = {
  s3Buckets: 's3_buckets',
  snsTopics: 'sns_topics',
  sqsQueues: 'sqs_queues',
  sqsSnsSubscriptions: 'sqs_sns_subscriptions'
}

export function initBasket() {
  return Object.fromEntries(
    Object.entries(Resources).map(([_, name]) => [name, {}])
  )
}

export function getBasketResource(basket, type, uuid) {
  return basket[type][uuid]
}

export function updateBasketResource(basket, type, uuid, resource) {
  return {
    ...basket,
    [type]: {
      ...basket?.[type],
      [uuid ?? randomUUID()]: resource
    }
  }
}

export function removeBasketResource(basket, type, uuid) {
  const typeValues = basket[type]
  delete typeValues[uuid]

  return {
    ...basket,
    [type]: {
      ...typeValues
    }
  }
}

export function getBasketResourceList(basket, type) {
  const typeValues = basket[type]
  return Object.entries(typeValues).map(([_, resource]) => resource)
}
