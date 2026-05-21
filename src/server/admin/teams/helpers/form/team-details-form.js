import Joi from 'joi'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { formatText } from '#config/nunjucks/filters/filters.js'

export default function teamDetailsForm(serverExtensions) {
  return {
    plugin: formEngine,
    options: {
      ext: serverExtensions,
      route: {
        path: '/admin/teams/{teamId}/edit'
      },
      layout: 'admin/teams/layouts/team-details.njk',
      // TODO: Use ext?
      layoutHandler() {
        return {
          pageTitle: 'Edit team',
          pageHeading: {
            text: 'Edit'
          }
        }
      },
      async schema(request) {
        const environments = getEnvironments(request.auth.credentials?.scope)

        return Joi.object({
          name: Joi.string()
            .label('Team name')
            .min(3)
            .max(53)
            .regex(/^[A-Za-z0-9-]+$/)
            .required()
            .messages({
              'string.base': validation.enterValue,
              'string.empty': validation.enterValue,
              'any.required': validation.enterValue,
              'string.min': validation.minCharacters(3),
              'string.max': validation.maxCharacters(50),
              'string.pattern.base':
                'Letters and numbers with hyphen separators'
            }),
          serviceCode: Joi.string()
            .label('Description')
            .meta({ component: 'textareaField' })
            .optional()
            .min(3)
            .max(3)
            .regex(/^[A-Z]+$/)
            .messages({
              'string.min': validation.exactLetters(3),
              'string.max': validation.exactLetters(3),
              'string.pattern.base': 'Provide 3 uppercase letters'
            }),
          description: Joi.string()
            .label('Service Code')
            .description('A service code consists of 3 uppercase letters')
            .optional()
            .max(256)
            .messages({
              'string.max': validation.maxCharacters(256)
            }),
          alertEmailAddresses: Joi.array()
            .label('Alert Emails')
            .description('Comma separated list of email addresses')
            .items(Joi.string().email())
            .optional(),
          alertEnvironments: Joi.array()
            .label('Alert Environments')
            .items(
              ...environments.map((env) =>
                Joi.string().valid(env).label(formatText(env))
              )
            )
            .optional()
        })
      }
    }
  }
}
