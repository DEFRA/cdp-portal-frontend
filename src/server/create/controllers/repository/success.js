import { config } from '~/src/config'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildLink } from '~/src/server/common/helpers/build-link'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { setStepComplete } from '~/src/server/create/helpers/form'

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

    return h.view('create/views/repository-success', {
      pageTitle: 'Status',
      heading: 'Status',
      caption: 'Your repository is being created',
      repositoryLink: buildLink(
        `https://github.com/${githubOrg}/${repositoryName}`,
        repositoryName
      )
    })
  }
}

export { repositorySuccessController }
