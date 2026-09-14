import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpUser } from '../../helpers/fetch/fetchers.js'
import { transformUserToSummary } from '../../transformers/user-to-summary.js'
import { userIdValidation } from '@defra/cdp-validation-kit'

const confirmDisableUserController = {
  options: {
    id: 'admin/users/{userId}/confirm-disable',
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const user = await fetchCdpUser(request.params?.userId)
    const displayName =
      user.disabled && user.name ? `${user.name} (Disabled)` : user.name

    return h.view('admin/users/views/disable/confirm-disable-user', {
      pageTitle: 'Confirm User Disable',
      summaryList: transformUserToSummary(user, false),
      user,
      displayName,
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
          text: displayName,
          href: `/admin/users/${user.userId}`
        },
        {
          text: 'Disable'
        }
      ]
    })
  }
}

export { confirmDisableUserController }
