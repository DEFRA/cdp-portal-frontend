import { config } from '#config/config.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'

const repositorySuccessController = {
  handler: async (request, h) => {
    const githubOrg = config.get('githubOrg')

    const create = request.app.getStepData()
    const repositoryName = create.repositoryName

    return h.view('create/repository/views/success', {
      pageTitle: 'Status',
      repositoryLink: buildLink({
        href: `https://github.com/${githubOrg}/${repositoryName}`,
        text: repositoryName
      })
    })
  }
}

export { repositorySuccessController }
