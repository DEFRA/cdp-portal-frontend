import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'
import { checkFeatureToggle } from '../../features/helpers/check-feature-toggle.js'
import { transformDecommissionToSummary } from '../transformers/decommission-to-summary.js'

const decommissionConfirmController = {
  options: {
    id: 'admin/decommissions/{repositoryName}/confirm',
    pre: [checkFeatureToggle]
  },
  handler: async (request, h) => {
    const entity = await fetchEntity(request.params.repositoryName)

    return h.view('admin/decommissions/views/decommission-confirm', {
      pageTitle: 'Confirm Decommission',
      entity,
      summaryList: transformDecommissionToSummary(null, entity),
      splitPaneBreadcrumbs: [
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

export { decommissionConfirmController }
