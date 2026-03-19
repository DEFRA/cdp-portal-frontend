import list from './controllers/entities-list.js'

export default {
  plugin: {
    name: 'dependencyExplorer',
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
          path: '/dependency-explorer',
          ...list
        }
      ])
    }
  }
}
