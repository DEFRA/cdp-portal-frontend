import { scopes } from '~/src/server/common/constants/scopes.js'
import { tagController } from '~/src/server/admin/tags/controllers/tag.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { addTagController } from '~/src/server/admin/tags/controllers/add-tag.js'
import { removeTagController } from '~/src/server/admin/tags/controllers/remove-tag.js'
import { listTagsListController } from '~/src/server/admin/tags/controllers/list-tags.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminTags = {
  plugin: {
    name: 'adminTags',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/tags',
            ...listTagsListController
          },
          {
            method: 'GET',
            path: '/admin/tags/{tag}',
            ...tagController
          },
          {
            method: 'POST',
            path: '/admin/tags/{tag}/add',
            ...addTagController
          },
          {
            method: 'POST',
            path: '/admin/tags/{tag}/remove/{serviceId}',
            ...removeTagController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminTags }
