import { appConfig } from '~/src/config'
import { fetchCodeRepository } from '~/src/app/code-repositories/helpers/fetch-code-repository'
import { transformCodeRepositoryToHeadingEntities } from '~/src/app/code-repositories/transformers/transform-code-repository-to-heading-entities'

const codeRepositoryController = {
  handler: async (request, h) => {
    const codeRepository = await fetchCodeRepository(
      request.params.codeRepositoryId
    )

    return h.view('code-repositories/views/code-repository', {
      pageTitle: `${codeRepository.serviceName} code repository`,
      heading: codeRepository.serviceName,
      codeRepository,
      headingEntities: transformCodeRepositoryToHeadingEntities(codeRepository),
      breadcrumbs: [
        {
          text: 'Code Repositories',
          href: `${appConfig.get('appPathPrefix')}/code-repositories`
        },
        {
          text: codeRepository.serviceName
        }
      ]
    })
  }
}

export { codeRepositoryController }
