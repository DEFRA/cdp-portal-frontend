import Boom from '@hapi/boom'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { fetchPermission } from '../../../helpers/fetchers.js'
import { fetchCdpUser } from '../../../../users/helpers/fetch/index.js'
import { buildOptions } from '../../../../../common/helpers/options/build-options.js'
import { provideStepData } from '../../../../../common/helpers/multistep-form/provide-step-data.js'

const scopeFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/{userId}/scope/{multiStepFormId}',
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required(),
        userId: Joi.string().uuid().required(),
        multiStepFormId: Joi.string().uuid().required()
      }),
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary', '')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const multiStepFormId = request.app.multiStepFormId
    const stepData = request.pre.stepData
    const redirectLocation = request.query.redirectLocation

    const { user } = await fetchCdpUser(stepData.userId)
    const { scope } = await fetchPermission(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/user/scope-form', {
      pageTitle: 'Scope - Add user permission',
      multiStepFormId,
      scope,
      stepData,
      teamOptions: buildOptions(
        user.teams.map((team) => ({ value: team.teamId, text: team.name })),
        false
      ),
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Permissions',
          href: '/admin/permissions'
        },
        {
          text: scope.value,
          href: '/admin/permissions/' + scope.scopeId
        },
        {
          text: 'Find user',
          // FIXME global step urls?
          href: request.routeLookup(
            'admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
            {
              params: { scopeId: scope.scopeId, multiStepFormId },
              query: { searchQuery: stepData.searchQuery }
            }
          )
        },
        {
          text: 'Scope'
        }
      ]
    })
  }
}

export { scopeFormController }
