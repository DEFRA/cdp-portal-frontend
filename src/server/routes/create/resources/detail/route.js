import { sessionNames } from '#server/common/constants/session-names.js'

export const options = {}

export default async function (request, h) {
  const basket = request.yar.get(sessionNames.resourcesRequest) ?? {
    s3_buckets: {}
  }

  console.dir(basket, { depth: 10 })

  return {
    basket
  }
}
