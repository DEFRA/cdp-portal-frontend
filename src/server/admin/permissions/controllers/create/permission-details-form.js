import { kindOptions } from '../../helpers/build-kind-options.js'

const createPermissionDetailsFormController = {
  options: {
    id: 'admin/permission/create'
  },
  handler: (_request, h) => {
    return h.view('admin/permissions/views/create/permission-details-form', {
      pageTitle: 'Create new permission',
      kindOptions,
      splitPaneBreadcrumbs: [
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
