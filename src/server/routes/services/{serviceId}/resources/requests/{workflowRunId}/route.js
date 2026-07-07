import { provideEntityExtension } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import Boom from '@hapi/boom'
import Joi from 'joi'

export const ext = [provideEntityExtension]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  },
  validate: {
    params: Joi.object({
      workflowRunId: Joi.number()
    }),
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {
  const workflowRunId = request.params.workflowRunId

  return {}
}
