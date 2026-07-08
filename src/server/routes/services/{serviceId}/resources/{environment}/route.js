import { serviceParamsValidation } from '#server/services/helpers/schema/service-params-validation.js'
import Boom from '@hapi/boom'

export { ext } from '../route.js'

export const options = {
  id: 'services/{serviceId}/resources/{environment}',
  validate: {
    params: serviceParamsValidation,
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {}
