import {
  showGithubLoginController,
  githubLoginCallbackController,
  githubLoginUpdateController
} from '~/src/server/login/github/controllers'

const githubLogin = {
  plugin: {
    name: 'githubLogin',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/login/github',
          ...showGithubLoginController
        },

        {
          method: 'GET',
          path: '/login/github/callback',
          ...githubLoginCallbackController
        },
        {
          method: 'POST',
          path: '/login/github/update',
          ...githubLoginUpdateController
        }
      ])
    }
  }
}

export { githubLogin }
