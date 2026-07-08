import {
  commonServiceExtensions,
  provideEntityExtension,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { scopes } from '@defra/cdp-validation-kit'
import Boom from '@hapi/boom'
import Joi from 'joi'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('resources', SERVICE),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  },
  validate: {
    params: Joi.object({
      serviceId: Joi.string(),
      workflowRunId: Joi.number()
    }),
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {
  const workflowRunId = request.params.workflowRunId

  return {}
}
