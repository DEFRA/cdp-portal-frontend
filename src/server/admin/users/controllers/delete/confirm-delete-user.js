import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'
import { transformUserToSummary } from '~/src/server/admin/users/transformers/user-to-summary.js'
import { transformUserTeamsToTaskList } from '~/src/server/admin/users/transformers/user-teams-to-task-list.js'

const confirmDeleteUserController = {
  options: {
    id: 'admin/users/{userId}/confirm-delete',
    validate: {
      params: Joi.object({
        userId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { user } = await fetchCdpUser(request.params?.userId)

    return h.view('admin/users/views/delete/confirm-delete-user', {
      pageTitle: 'Confirm User Deletion',
      summaryList: transformUserToSummary(user, false),
      teamsTaskList: transformUserTeamsToTaskList(user),
      user,
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
          text: user.name,
          href: `/admin/users/${user.userId}`
        },
        {
          text: 'Delete'
        }
      ]
    })
  }
}

export { confirmDeleteUserController }
