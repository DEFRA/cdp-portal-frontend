import Joi from 'joi'
import { formatText } from '#config/nunjucks/filters/filters.js'
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

  async schema() {
    return Joi.object({
      info: Joi.string()
        .label('Important')
        .description(
          'Production data must only be loaded into the Production environment.'
        )
        .meta({
          component: 'informationField'
        }),
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
        .required()
    })
  },

  async actions(request) {
    const { path = '', environment } = request.params
    const parentPath = path.split('/').slice(0, -1).join('/')
    const entity = request.app.entity

    return {
      submit: {
        text: 'Import',
        async method(request, h, sanitisedFormValues) {
          const { target } = sanitisedFormValues

          const startDatabaseImportUrl =
            config.get('selfServiceOpsUrl') + '/start-database-import'

          const { payload } = await request.authedFetchJson(
            startDatabaseImportUrl,
            {
              method: 'POST',
              payload: {
                service: entity.name,
                environment,
                target,
                path
              }
            }
          )

          return h.redirect(
            `/deployments/database-updates/${environment}/${payload.importId}`
          )
        }
      },
      cancel: {
        text: 'Cancel',
        url: `/services/${entity.name}/imports/${environment}/${parentPath}`
      }
    }
  }
}
