import Joi from 'joi'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { config } from '#config/config.js'

const IMPORT_TYPES = ['postgres']

export default {
  title(request) {
    const { target } = request.query
    return target === null ? 'Import data file' : 'Summary'
  },

  description(request) {
    const { path = '' } = request.params
    return `Import data file <strong>${path}</strong> into database`
  },

  async schema(request) {
    const { environment, path } = request.params
    const { target } = request.query

    if (target) {
      return Joi.object({
        info: Joi.string()
          .label('Important')
          .description(
            'Production data must only be loaded into the Production environment.'
          )
          .meta({
            component: 'informationField',
            classes: 'govuk-!-margin-bottom-8'
          }),
        summary: Joi.string()
          .label('Summary')
          .description(
            'Production data must only be loaded into the Production environment.'
          )
          .default({
            environment: formatText(environment),
            file: path,
            type: formatText(target)
          })
          .meta({
            component: 'summaryField'
          })
      })
    }

    return Joi.object({
      info: Joi.string()
        .label('Important')
        .description(
          'Production data must only be loaded into the Production environment.'
        )
        .meta({
          component: 'informationField',
          classes: 'govuk-!-margin-bottom-8'
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
    const { target } = request.query
    const parentPath = path.split('/').slice(0, -1).join('/')
    const entity = request.app.entity

    if (target) {
      return {
        submit: {
          text: 'Import',
          async method(request, h) {
            const { target } = request.query
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

    return {
      submit: {
        text: 'Next',
        async method(_request, h, sanitisedFormValues) {
          const { target } = sanitisedFormValues

          return h.redirect(
            `/services/${entity.name}/imports-action/${environment}/${path}?action=import&target=${target}`
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
