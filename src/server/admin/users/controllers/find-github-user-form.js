import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/common/helpers/build-options'
import { fetchGitHubUsers } from '~/src/server/admin/users/helpers/fetch-github-users'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { resetGitHubAnswer } from '~/src/server/admin/users/helpers/extensions/reset-github-answer'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'

const findGitHubUserFormController = {
  options: {
    ext: {
      onPreHandler: resetGitHubAnswer
    },
    pre: [noSessionRedirect],
    validate: {
      query: Joi.object({
        githubSearch: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    // TODO can this be done programmatically?
    setStepComplete(request, 'stepOne')

    const query = request?.query
    const githubSearch = query?.githubSearch
    const redirectLocation = query?.redirectLocation

    const gitHubUsers = githubSearch ? await fetchGitHubUsers(githubSearch) : []

    return h.view('admin/users/views/github-user-form', {
      pageTitle: 'Find Defra ORG GitHub User',
      heading: 'Find Defra ORG GitHub User',
      headingCaption: 'Search for the Defra ORG GitHub user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch },
      gitHubUsers: buildOptions(
        gitHubUsers.map((gitHubUser) => ({
          text: `@${gitHubUser.login} - ${gitHubUser.name}`,
          value: gitHubUser.login
        })),
        false
      )
    })
  }
}

export { findGitHubUserFormController }
