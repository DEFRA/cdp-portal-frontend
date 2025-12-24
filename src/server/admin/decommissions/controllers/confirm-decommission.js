import { sessionNames } from '../../../common/constants/session-names.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'
import { decommission } from '../helpers/fetchers.js'
import {
  isDecommissioningInProgress,
  isPostgresDeleteProtectionEnabled
} from '../helpers/decommissioning-checks.js'

const confirmDecommissionController = {
  options: {
    id: 'post:admin/decommissions/{repositoryName}/confirm'
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

    if (isPostgresDeleteProtectionEnabled(entityToDecommission)) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'Postgres delete protection must be disabled before decommissioning.'
      )
      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }

    try {
      const { credentials } = request.auth

      await decommission(repositoryName, credentials)

      request.yar.flash(sessionNames.notifications, {
        text: 'Decommission requested',
        type: 'success'
      })

      request.audit.sendMessage({
        event: 'Decommission',
        data: { repositoryName }
      })

      return h.redirect(`/admin/decommissions/${repositoryName}`)
    } catch (error) {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName }
      })
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }
  }
}

export { confirmDecommissionController }
