import { config } from '~/src/config/index.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { buildLink } from '~/src/server/common/helpers/build-link.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { setStepComplete } from '~/src/server/create/helpers/form/index.js'

const testSuiteSuccessController = {
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

    return h.view('create/journey-test-suite/views/success', {
      pageTitle: 'Status',
      heading: 'Status',
      caption: 'Your journey test suite is being created',
      testSuiteLink: buildLink(
        `https://github.com/${githubOrg}/${repositoryName}`,
        repositoryName
      )
    })
  }
}

export { testSuiteSuccessController }
