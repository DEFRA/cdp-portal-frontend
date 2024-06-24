import Joi from 'joi'
import Boom from '@hapi/boom'

import { transformRemoveUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-remove-user-to-entity-data-list'

const confirmUserDelete = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { user } = await request.server.methods.fetchCdpUser(
      request.params?.userId
    )
    const title = 'Confirm user deletion'

    return h.view('admin/users/views/delete/confirm-user-delete', {
      pageTitle: title,
      heading: title,
      entityDataList: transformRemoveUserToEntityDataList(user),
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
          text: title
        }
      ]
    })
  }
}

export { confirmUserDelete }
