import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/common/helpers/build-options'
import { fetchGitHubUsers } from '~/src/server/admin/users/helpers/fetch-github-users'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { resetGitHubAnswer } from '~/src/server/admin/users/helpers/extensions/reset-github-answer'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { appConfig } from '~/src/config'

const findGitHubUserFormController = {
  options: {
    ext: {
      onPreHandler: resetGitHubAnswer
    },
    pre: [noSessionRedirect, provideCdpUser],
    validate: {
      query: Joi.object({
        githubSearch: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    setStepComplete(request, 'stepOne')

    const cdpUser = request.pre?.cdpUser

    const query = request?.query
    const githubSearch = query?.githubSearch
    const redirectLocation = query?.redirectLocation

    const gitHubUsers = githubSearch ? await fetchGitHubUsers(githubSearch) : []

    const isEdit = cdpUser.isEdit ?? false

    const heading = isEdit
      ? 'Update Defra GitHub User'
      : 'Find Defra GitHub User'

    return h.view('admin/users/views/github-user-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Search for the Defra GitHub user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch },
      gitHubUsers: buildOptions(
        gitHubUsers.map((gitHubUser) => ({
          text: `@${gitHubUser.github} ${
            gitHubUser.name ? `- ${gitHubUser.name}` : ''
          }`,
          value: gitHubUser.github
        })),
        false
      ),
      breadcrumbs: [
        {
          text: 'Admin',
          href: appConfig.get('appPathPrefix') + '/admin'
        },
        {
          text: 'Users',
          href: appConfig.get('appPathPrefix') + '/admin/users'
        },
        {
          text: isEdit ? 'Update' : 'Create' + ' user'
        }
      ]
    })
  }
}

export { findGitHubUserFormController }
