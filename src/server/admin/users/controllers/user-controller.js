import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { fetchUser } from '~/src/server/admin/users/helpers/fetch-user'
import { transformUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-user-to-entity-data-list'

const userController = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { user } = await fetchUser(request.params?.userId)

    return h.view('admin/users/views/user', {
      pageTitle: startCase(user.name),
      heading: startCase(user.name),
      entityDataList: transformUserToEntityDataList(user)
    })
  }
}

export { userController }
