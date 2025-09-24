import Boom from '@hapi/boom'
import { userIdValidation } from '@defra/cdp-validation-kit'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { fetchPermission } from '../../../helpers/fetchers.js'
import { fetchCdpUser } from '../../../../users/helpers/fetch/fetchers.js'
import { userPermissionToSummary } from '../../../transformers/user-permission-to-summary.js'
import { provideStepData } from '../../../../../common/helpers/multistep-form/provide-step-data.js'
import { urlTemplates } from '../../../helpers/multistep-form/add/user/steps.js'
import { populateUrls } from '../../../../../common/helpers/multistep-form/populate-urls.js'

const summaryController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}',
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required(),
        userId: userIdValidation,
        multiStepFormId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const params = request.params
    const stepData = request.pre?.stepData
    const multiStepFormId = request.params?.multiStepFormId

    const user = await fetchCdpUser(stepData.userId)
    const userId = user.userId

    const scope = await fetchPermission(request, request.params.scopeId)
    const scopeId = scope.scopeId

    const stepUrls = populateUrls({ stepData, params, urlTemplates })

    return h.view('admin/permissions/views/add/member/summary', {
      pageTitle: 'Summary - Add user permission',
      userPermissionSummaryRows: userPermissionToSummary({
        user,
        scope,
        stepData,
        stepUrls
      }),
      multiStepFormId,
      scope,
      stepData,
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
              params: { scopeId, multiStepFormId },
              query: { searchQuery: stepData.searchQuery }
            }
          )
        },
        {
          text: 'Scope',
          href: request.routeLookup(
            'admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
            { params: { scopeId, userId, multiStepFormId } }
          )
        },
        {
          text: 'Summary'
        }
      ]
    })
  }
}

export { summaryController }
