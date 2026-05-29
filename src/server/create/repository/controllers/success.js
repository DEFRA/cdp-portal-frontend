import { config } from '#config/config.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'
import { setStepComplete } from '../../helpers/form/index.js'

const repositorySuccessController = {
  handler: async (request, h) => {
    await setStepComplete(request, h, 'allSteps')

    const githubOrg = config.get('githubOrg')

    const create = request.app.getStepData()
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
