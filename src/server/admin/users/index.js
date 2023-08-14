import {
  usersListController,
  userController
} from '~/src/server/admin/users/controllers'

const adminUsers = [
  {
    method: 'GET',
    path: '/admin/users',
    ...usersListController
  },
  {
    method: 'GET',
    path: '/admin/users/{userId}',
    ...userController
  }
  // {
  //   method: 'GET',
  //   path: '/admin/create/user',
  //   ...librariesListController
  // },
  // {
  //   method: 'POST',
  //   path: '/admin/create/user',
  //   ...librariesListController
  // },
  // {
  //   method: 'PATCH',
  //   path: '/admin/edit/user/{userId}',
  //   ...libraryController
  // }
]

export { adminUsers }
