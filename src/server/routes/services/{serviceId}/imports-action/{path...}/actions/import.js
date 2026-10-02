import { createEmptyFolder } from '#server/common/services/bucket-service/BucketService.js'
import Joi from 'joi'
import { orderedEnvironments } from '@defra/cdp-validation-kit'
import { formatText } from '#config/nunjucks/filters/filters.js'

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
    const { path = '' } = request.params
    const entity = request.app.entity

    return Joi.object({
      environment: Joi.string()
        .label('Environment')
        .description('Target environment for import')
        .valid(...orderedEnvironments)
        .meta({
          component: 'selectField',
          suggestions: orderedEnvironments.map((env) => ({
            text: formatText(env),
            value: env
          }))
        })
        .default('dev'),
      type: Joi.string()
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
    const entity = request.app.entity

    return {
      submit: {
        text: 'Create',
        async method(request, h, sanitisedFormValues) {
          const { name } = sanitisedFormValues

          await createEmptyFolder(
            request,
            `/entities/${entity.name}/imports/`,
            `${path}/${name}`
          )

          return h.redirect(`/services/${entity.name}/imports/${path}`)
        }
      },
      cancel: {
        text: 'Cancel',
        url: `/services/${entity.name}/imports/${path}`
      }
    }
  }
}
