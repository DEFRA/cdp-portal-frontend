import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { fetchEntities } from '../../../common/helpers/fetch/fetch-entities.js'
import { sortByName } from '../../../common/helpers/sort/sort-by-name.js'
import { checkFeatureToggle } from '../../features/helpers/check-feature-toggle.js'

const decommissionFormController = {
  options: {
    id: 'admin/decommissions/start',
    pre: [checkFeatureToggle]
  },
  handler: async (request, h) => {
    const entities = await fetchEntities()

    const repositoriesValues =
      entities
        .map((e) => e.name)
        .toSorted(sortByName)
        .map((entity) => ({ value: entity, text: entity })) ?? []

    const repositoriesOptions = buildOptions(repositoriesValues)

    return h.view('admin/decommissions/views/decommission-form', {
      pageTitle:
        'Decommission Microservice, Prototype, Test-Suite and Repository',
      repositoriesOptions,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Decommissions',
          href: '/admin/decommissions'
        },
        {
          text: 'Decommission'
        }
      ]
    })
  }
}

export { decommissionFormController }
