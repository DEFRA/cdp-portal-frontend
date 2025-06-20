import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'
import { transformUserToSummary } from '~/src/server/admin/users/transformers/user-to-summary.js'
import { transformUserTeamsToTaskList } from '~/src/server/admin/users/transformers/user-teams-to-task-list.js'
import { transformUserScopesToTaskList } from '~/src/server/admin/users/transformers/user-scopes-to-task-list.js'
import { userIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const userController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { user } = await fetchCdpUser(request.params?.userId)

    return h.view('admin/users/views/user', {
      pageTitle: user.name,
      user,
      summaryList: transformUserToSummary(user),
      teamsTaskList: transformUserTeamsToTaskList(user),
      scopesTaskList: transformUserScopesToTaskList(user),
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: user.name
        }
      ]
    })
  }
}

export { userController }
