import { config } from '~/src/config'
import { fetchRepository } from '~/src/app/repositories/helpers/fetch-repository'
import { transformRepositoryToHeadingEntities } from '~/src/app/repositories/transformers/transform-service-to-heading-entities'

const repositoryController = {
  handler: async (request, h) => {
    const repository = await fetchRepository(request.params.repositoryId)

    return h.view('repositories/views/repository', {
      pageTitle: `${repository.serviceName} Repository`,
      heading: repository.serviceName,
      repository,
      headingEntities: transformRepositoryToHeadingEntities(repository),
      breadcrumbs: [
        {
          text: 'Repositories',
          href: `${config.get('appPathPrefix')}/services`
        },
        {
          text: repository.serviceName
        }
      ]
    })
  }
}

export { repositoryController }
