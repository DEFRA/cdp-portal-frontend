import Boom from '@hapi/boom'

import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'

const availableEnvironmentsController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }
    const authedUser = await request.getUserSession()
    const userScopes = authedUser?.scope

    try {
      const entity = await fetchEntity(request.query?.serviceName).catch(
        nullify404
      )
      const environments = getEnvironments(userScopes, entity?.type)
      return environments ? buildSuggestions(environments) : []
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error.output.statusCode)
    }
  }
}

export { availableEnvironmentsController }
