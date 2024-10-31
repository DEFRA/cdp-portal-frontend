import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchCreateStatus } from '~/src/server/services/helpers/fetch/fetch-create-status.js'

const isNameAvailableController = {
  options: {
    validate: {
      params: Joi.object({
        repositoryName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const repositoryName = request.params?.repositoryName
    const responses = await Promise.allSettled([
      fetchRepository(repositoryName),
      fetchCreateStatus(repositoryName)
    ])

    const rejected404Statuses = responses
      .filter((response) => response.status === 'rejected')
      .filter((response) => response?.reason?.output?.statusCode === 404)

    if (rejected404Statuses.length === 2) {
      return h.response({
        message: 'success',
        isAvailable: true
      })
    }

    return h.response({
      message: 'success',
      isAvailable: false
    })
  }
}

export { isNameAvailableController }
