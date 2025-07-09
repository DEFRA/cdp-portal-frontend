import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'

const decommissionFormController = {
  options: {
    id: 'admin/decommissions/start'
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
      pageTitle: 'Decommission micro-service',
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
