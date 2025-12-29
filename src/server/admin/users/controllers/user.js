import Joi from 'joi'
import Boom from '@hapi/boom'

import {fetchCdpUser, fetchPermissionDiagram} from '../helpers/fetch/fetchers.js'
import { transformUserToSummary } from '../transformers/user-to-summary.js'
import { transformUserTeamsToTaskList } from '../transformers/user-teams-to-task-list.js'
import { userIdValidation } from '@defra/cdp-validation-kit'
import { transformUserScopesToRows } from '../transformers/user-scopes-to-rows.js'

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
    const user = await fetchCdpUser(request.params?.userId)
    const diagram = await fetchPermissionDiagram(request.params?.userId)

    return h.view('admin/users/views/user', {
      pageTitle: user.name,
      user,
      diagram,
      summaryList: transformUserToSummary(user),
      teamsTaskList: transformUserTeamsToTaskList(user),
      userScopesRows: transformUserScopesToRows(user),
      splitPaneBreadcrumbs: [
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
