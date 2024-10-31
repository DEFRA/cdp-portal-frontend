import Joi from 'joi'
import Boom from '@hapi/boom'

import { transformUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-user-to-entity-data-list.js'
import { transformUserToHeadingEntities } from '~/src/server/admin/users/transformers/transform-user-to-heading-entities.js'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'

const userController = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { user } = await fetchCdpUser(request.params?.userId)

    return h.view('admin/users/views/user', {
      pageTitle: user.name,
      heading: user.name,
      headingEntities: transformUserToHeadingEntities(user),
      entityDataList: transformUserToEntityDataList(user),
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
          text: user.name
        }
      ]
    })
  }
}

export { userController }
