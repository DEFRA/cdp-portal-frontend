import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import {
  createS3BucketFormController,
  createS3BucketPostController
} from '#server/admin/create/s3/controllers/create-s3-controllers.js'
import { adminCreateController } from '#server/admin/create/controllers/create-controller.js'

const adminUserScope = authScope([scopes.admin])

const adminCreate = {
  plugin: {
    name: 'adminCreate',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: `/admin/create`,
            ...adminCreateController
          },
          {
            method: 'GET',
            path: '/admin/create/s3',
            ...createS3BucketFormController
          },
          {
            method: 'POST',
            path: '/admin/create/s3',
            ...createS3BucketPostController
          }
        ].map(adminUserScope)
      )
    }
  }
}

export { adminCreate }
