import {
  teamController,
  teamsListController
} from '~/src/app/teams/controllers'

const teams = {
  plugin: {
    name: 'teams',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/teams',
          ...teamsListController
        },
        {
          method: 'GET',
          path: '/teams/{teamId}',
          ...teamController
        }
      ])
    }
  }
}

export { teams }
