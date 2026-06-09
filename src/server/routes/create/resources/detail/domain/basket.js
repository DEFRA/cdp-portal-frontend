import { randomUUID } from 'node:crypto'

export function initBasket() {
  return {
    s3_buckets: {},
    sns_topics: {}
  }
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
  return updateBasketResource(basket, type, uuid, undefined)
}
