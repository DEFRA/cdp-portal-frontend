import Boom from '@hapi/boom'
import { userIdValidation } from '@defra/cdp-validation-kit'

import Joi from 'joi'
import { fetchPermission } from '../../../helpers/fetchers.js'
import { fetchCdpUser } from '../../../../users/helpers/fetch/fetchers.js'
import { buildOptions } from '../../../../../common/helpers/options/build-options.js'
import { provideStepData } from '../../../../../common/helpers/multistep-form/provide-step-data.js'

const teamScopeFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
    validate: {
      params: Joi.object({
        scopeId: Joi.string().required(),
        userId: userIdValidation,
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

    const user = await fetchCdpUser(stepData.userId)
    const scope = await fetchPermission(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/member/team-scope-form', {
      pageTitle: 'Team scope - Add user permission',
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

export { teamScopeFormController }
