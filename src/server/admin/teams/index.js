import {
  teamsListController,
  teamController
} from '~/src/server/admin/teams/controllers'

const adminTeams = [
  {
    method: 'GET',
    path: '/admin/teams',
    ...teamsListController
  },
  {
    method: 'GET',
    path: '/admin/teams/{teamId}',
    ...teamController
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
