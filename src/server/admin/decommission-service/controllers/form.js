import Joi from 'joi'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'
import { isFeatureToggleActive } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

const decommissionDisabledProperties = {
  pageTitle: 'Decommission is unavailable',
  heading: 'Decommission is unavailable',
  mainBody: ['To enable, deactivate the feature toggle.']
}

const decommissionFormController = {
  options: {
    validate: {
      query: Joi.object({
        serviceName: Joi.string().optional()
      })
    }
  },
  handler: async (request, h) => {
    const decommissionDisabled = await isFeatureToggleActive(
      request.featureToggles,
      'decommission-disabled'
    )
    if (decommissionDisabled) {
      return h.view('common/views/disabled', decommissionDisabledProperties)
    }

    const entities = await fetchEntities()
    const serviceName = request.query.serviceName ?? ''

    const repositoriesValues = entities
      .map((e) => e.name)
      .sort(sortByName)
      .map((entity) => {
        return { value: entity, text: entity }
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
