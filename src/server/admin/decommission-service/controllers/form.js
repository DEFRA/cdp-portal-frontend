import Joi from 'joi'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'

const decommissionFormController = {
  options: {
    validate: {
      query: Joi.object({
        serviceName: Joi.string().optional()
      })
    }
  },
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const serviceName = request.query.serviceName ?? ''

    const repositoriesValues = repositories.map((repo) => {
      return { value: repo.id, text: repo.id }
    })

    const repositoriesOptions = buildOptions(repositoriesValues ?? [])

    return h.view('admin/decommission-service/views/form', {
      pageTitle: 'Decommission Service',
      serviceName,
      formValues: {
        serviceName
      },
      repositoriesOptions
    })
  }
}

export { decommissionFormController }
