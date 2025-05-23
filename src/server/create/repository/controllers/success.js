import { config } from '~/src/config/config.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { setStepComplete } from '~/src/server/create/helpers/form/index.js'

const repositorySuccessController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    await setStepComplete(request, h, 'allSteps')

    const githubOrg = config.get('githubOrg')

    const create = request.pre?.create
    const repositoryName = create.repositoryName

    return h.view('create/repository/views/success', {
      pageTitle: 'Status',
      heading: 'Status',
      caption: 'Your repository is being created',
      repositoryLink: buildLink({
        href: `https://github.com/${githubOrg}/${repositoryName}`,
        text: repositoryName
      })
    })
  }
}

export { repositorySuccessController }
