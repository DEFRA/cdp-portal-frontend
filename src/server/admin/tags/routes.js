import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'

import { scopes } from '~/src/server/common/constants/scopes.js'
import { listTagsListController } from '~/src/server/admin/tags/controllers/list-tags.js'
import { editTagController } from '~/src/server/admin/tags/controllers/edit-tag.js'
import { addTagController } from '~/src/server/admin/tags/controllers/add-tag.js'
import { removeTagController } from '~/src/server/admin/tags/controllers/remove-tag.js'

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
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/tags/{tag}',
            ...editTagController
          },
          {
            method: 'GET',
            path: '/admin/tags',
            ...listTagsListController
          },
          {
            method: 'POST',
            path: '/admin/tags/{tag}/add',
            ...addTagController
          },
          {
            method: 'POST',
            path: '/admin/tags/{tag}/remove',
            ...removeTagController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminTags }
