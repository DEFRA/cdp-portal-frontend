import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'

const decommissionFormController = {
  handler: async (_request, h) => {
    const { repositories } = await fetchRepositories()

    const repositoriesValues = repositories.map((repo) => {
      return { value: repo.id, text: repo.id }
    })

    const repositoriesOptions = buildOptions(repositoriesValues ?? [])

    return h.view('admin/decommission-service/views/decommission-form', {
      pageTitle: 'Decommission Service',
      heading: 'Decommission a service',
      headingCaption: 'Provide the service name to decommission',
      repositoriesOptions
    })
  }
}

export { decommissionFormController }
