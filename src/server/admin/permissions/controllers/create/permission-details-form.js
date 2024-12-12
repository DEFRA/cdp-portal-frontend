import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'

const createPermissionDetailsFormController = {
  options: {
    id: 'admin/permission/create'
  },
  handler: (_request, h) => {
    const kindOptions = buildOptions(
      [
        { text: 'User', value: 'user' },
        { text: 'Team', value: 'team' }
      ],
      false
    )

    return h.view('admin/permissions/views/create/permission-details-form', {
      pageTitle: 'Create new permission',
      kindOptions,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Permissions',
          href: '/admin/permissions'
        },
        {
          text: 'Create'
        }
      ]
    })
  }
}

export { createPermissionDetailsFormController }
