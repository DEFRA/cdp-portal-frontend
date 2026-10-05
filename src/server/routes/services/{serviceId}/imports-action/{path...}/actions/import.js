import Joi from 'joi'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { config } from '#config/config.js'

const IMPORT_TYPES = ['postgres']

export default {
  title() {
    return 'Import data file'
  },

  description(request) {
    const { path = '' } = request.params
    return `Import data file <strong>${path}</strong> into database`
  },

  async schema(request) {
    // const { path = '' } = request.params
    const entity = request.app.entity
    const userSession = request.auth.credentials

    const environments = getEnvironments(userSession?.scope, entity?.subType)

    return Joi.object({
      environment: Joi.string()
        .label('Environment')
        .description('Target environment for import')
        .valid(...environments)
        .meta({
          component: 'selectField',
          suggestions: environments.map((env) => ({
            text: formatText(env),
            value: env
          }))
        })
        .default('dev'),
      target: Joi.string()
        .label('Type')
        .description('Type of import to run')
        .valid(...IMPORT_TYPES)
        .meta({
          component: 'selectField',
          suggestions: IMPORT_TYPES.map((type) => ({
            text: formatText(type),
            value: type
          }))
        })
    })
  },

  async actions(request) {
    const { path = '' } = request.params
    const parentPath = path.split('/').slice(0, -1).join('/')
    const entity = request.app.entity

    return {
      submit: {
        text: 'Import',
        async method(request, h, sanitisedFormValues) {
          const { environment, target } = sanitisedFormValues

          const startDatabaseImportUrl =
            config.get('selfServiceOpsUrl') + '/start-database-import'
          const bucket = 'cdp-infra-dev-database-migrations'

          await request.authedFetchJson(startDatabaseImportUrl, {
            method: 'POST',
            payload: {
              service: entity.name,
              environment,
              target,
              s3File: `S3://${bucket}/entities/${entity.name}/imports/${path}`
            }
          })

          return h.redirect(`/services/${entity.name}/imports/${parentPath}`)
        }
      },
      cancel: {
        text: 'Cancel',
        url: `/services/${entity.name}/imports/${parentPath}`
      }
    }
  }
}
