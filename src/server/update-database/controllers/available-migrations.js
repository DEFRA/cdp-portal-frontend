import Boom from '@hapi/boom'

import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'
import { fetchMigrations } from '~/src/server/services/helpers/fetch/fetch-migrations.js'

const availableMigrationsController = {
  handler: async (request, h) => {
    if (!request.isXhr()) {
      return Boom.methodNotAllowed('This route is only available via XHR')
    }

    try {
      const migrations = await fetchMigrations(request.query?.serviceName)

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
