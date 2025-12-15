import Boom from '@hapi/boom'

import Joi from 'joi'
import { fetchPermission } from '../../../helpers/fetchers.js'
import { buildUsersOptions } from '../../../helpers/user/build-user-options.js'
import { provideSelectedUser } from '../../../helpers/pre/provide-selected-user.js'
import { provideStepData } from '../../../../../common/helpers/multistep-form/provide-step-data.js'

const findUserFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
    validate: {
      params: Joi.object({
        scopeId: Joi.string().required(),
        multiStepFormId: Joi.string().uuid().optional()
      }),
      query: Joi.object({
        searchQuery: Joi.string().allow(''),
        userId: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary', '')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideStepData, provideSelectedUser]
  },
  handler: async (request, h) => {
    const multiStepFormId = request.app.multiStepFormId
    const query = request.query
    const searchQuery = query.searchQuery
    const selectedUser = request.pre.selectedUser
    const redirectLocation = query.redirectLocation

    const scope = await fetchPermission(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/member/find-user-form', {
      pageTitle: 'Find user - Add user permission',
      multiStepFormId,
      scope,
      formValues: {
        searchQuery,
        userId: selectedUser?.userId
      },
      userOptions: await buildUsersOptions(searchQuery, scope, selectedUser),
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
          text: 'Find user'
        }
      ]
    })
  }
}

export { findUserFormController }
