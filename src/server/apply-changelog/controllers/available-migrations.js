import Boom from '@hapi/boom'

import { relativeDate } from '../../common/helpers/date/relative-date.js'
import { fetchAvailableMigrations } from '../../services/helpers/fetch/fetch-available-migrations.js'

const availableMigrationsController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

    try {
      const migrations = await fetchAvailableMigrations(
        request.query?.serviceName
      )

      if (migrations.length === 0) {
        return [
          {
            text: ' - - no versions - - ',
            hint: '',
            disabled: true,
            attributes: { selected: true }
          }
        ]
      }

      return migrations.map((migration) => ({
        text: migration.version,
        value: migration.version,
        hint: relativeDate(migration.created)
      }))
    } catch (error) {
      return h
        .response({ message: error.message })
        .code(error.output.statusCode)
    }
  }
}

export { availableMigrationsController }
