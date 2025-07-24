import { config } from '../../../../config/config.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { setStepComplete } from '../../helpers/form/index.js'

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
