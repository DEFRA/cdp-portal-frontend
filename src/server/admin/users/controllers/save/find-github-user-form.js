import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { searchGithubUsers } from '../../helpers/fetch/fetchers.js'
import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'

const findGithubUserFormController = {
  options: {
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      }),
      query: Joi.object({
        githubSearch: Joi.string().allow(''),
        github: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId

    const query = request?.query
    const githubSearch = query?.githubSearch ?? cdpUser?.github
    const github = query?.github
    const redirectLocation = query?.redirectLocation

    const searchGithubUsersResponse = githubSearch
      ? await searchGithubUsers(githubSearch)
      : null
    const githubUsers = searchGithubUsersResponse ?? []

    return h.view('admin/users/views/save/github-user-form', {
      pageTitle: 'Find Defra GitHub User',
      multiStepFormId,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch, github },
      githubUsers: buildOptions(
        githubUsers.map((githubUser) => ({
          text: `@${githubUser.github} ${
            githubUser.name ? `- ${githubUser.name}` : ''
          }`,
          value: githubUser.github
        })),
        false
      ),
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: 'Create'
        }
      ]
    })
  }
}

export { findGithubUserFormController }
