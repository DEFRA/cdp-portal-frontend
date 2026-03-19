import list from './controllers/dependencies-list.js'

export default {
  plugin: {
    name: 'dependenciesExplorer',
    register: (server) => {
      // server.ext([
      //   {
      //     type: 'onPostHandler',
      //     method: provideFormContextValues(sessionNames.cdpTeam),
      //     options: {
      //       before: ['yar'],
      //       sandbox: 'plugin'
      //     }
      //   }
      // ])

      server.route([
        {
          method: 'GET',
          path: '/dependencies',
          ...list
        }
      ])
    }
  }
}
