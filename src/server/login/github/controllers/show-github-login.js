import { config } from '~/src/config'

import { findCdpGithubHandle } from '~/src/server/common/helpers/user/find-cdp-github-handle'

const clientId = config.get('github.client.id')
const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`

const showGithubLoginController = {
  handler: async (request, h) => {
    const githubHandle = await findCdpGithubHandle(request)

    if (githubHandle) {
      const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'
      return h.redirect(redirect)
    }

    return h.view('login/github/views/github-login', {
      pageTitle: 'Link with GitHub',
      heading: 'Link with GitHub',
      headingCaption:
        'Log into GitHub and link your CDP profile with a Github handle.',
      githubLoginUrl,
      logoutUrl: '/logout'
    })
  }
}

export { showGithubLoginController }
