import { sessionNames } from '../../../common/constants/session-names.js'
import { isDecommissioningInProgress } from '../helpers/decommissioning-checks.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'

const startDecommissionController = {
  options: {
    id: 'post:admin/decommissions/start'
  },
  handler: async (request, h) => {
    const repositoryName = request.payload.repositoryName

    if (await isDecommissioningInProgress()) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'There is already an entity being decommissioned'
      )

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName }
      })

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }

    const entityToDecommission = await fetchEntity(repositoryName)

    if (!entityToDecommission) {
      const errorDetails = {
        repositoryName: {
          message: 'Choose an entry'
        }
      }
      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName },
        formErrors: errorDetails
      })

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }

    try {
      return h.redirect(`/admin/decommissions/${repositoryName}/confirm`)
    } catch (error) {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName }
      })
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }
  }
}

export { startDecommissionController }
