import { teamsList, team } from '~/src/server/admin/teams/controllers'

const adminTeams = [
  {
    method: 'GET',
    path: '/admin/teams',
    ...teamsList
  },
  {
    method: 'GET',
    path: '/admin/teams/{teamId}',
    ...team
  }
  // {
  //   method: 'GET',
  //   path: '/admin/create/team',
  //   ...librariesListController
  // },
  // {
  //   method: 'POST',
  //   path: '/admin/create/team',
  //   ...librariesListController
  // },
  // {
  //   method: 'PATCH',
  //   path: '/admin/edit/team/{teamId}',
  //   ...libraryController
  // }
]

export { adminTeams }
