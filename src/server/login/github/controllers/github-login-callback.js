import { findGithubHandle } from '~/src/server/login/github/helpers/find-github-user'

const githubLoginCallbackController = {
  handler: async (request, h) => {
    const code = request.query.code
    request.logger.debug({ code }, 'GitHub login callback')

    //  const authedUser = await request.getUserSession()

    const githubHandle = await findGithubHandle(code, request.logger)
    request.logger.debug({ githubHandle }, 'GitHub handle')

    return h.view('login/github/views/github-login-update', {
      pageTitle: 'Link GitHub handle',
      heading: 'Link GitHub handle',
      headingCaption: 'Link your CDP profile with your Github handle.',
      githubCode: code,
      githubHandle,
      githubUpdateAction: '/login/github/update',
      logoutUrl: '/logout'
    })
  }
}

export { githubLoginCallbackController }
