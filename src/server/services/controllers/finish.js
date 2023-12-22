import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchFinishCreate } from '~/src/server/services/helpers/fetch/fetch-finish-create'

const finishController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId

    const { repositoryName } = await fetchFinishCreate(serviceId)

    request.yar.flash(sessionNames.notifications, {
      text: 'Welcome to your new microservice',
      type: 'success'
    })

    return h.redirect(`/services/${repositoryName}`)
  }
}

export { finishController }
