import Joi from 'joi'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import formEngine from '#server/plugins/form-engine/form-engine.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { scopes } from '@defra/cdp-validation-kit'
import { sessionNames } from '#server/common/constants/session-names.js'
import { editTeam } from '../fetch/fetchers.js'

export default function teamDetailsForm(serverExtensions) {
  return {
    plugin: formEngine,
    options: {
      ext: serverExtensions,
      route: {
        path: '/admin/teams/{teamId}/edit',
        options: {
          auth: {
            mode: 'required',
            access: {
              scope: scopes.admin
            }
          }
        }
      },
      layout: 'admin/teams/layouts/team-details.njk',
      // TODO: Use ext?
      layoutHandler() {
        return {
          pageTitle: 'Edit team',
          pageHeading: {
            text: 'Edit'
          },
          splitPaneBreadcrumbs: [
            {
              text: 'Admin',
              href: '/admin'
            },
            {
              text: 'Teams',
              href: '/admin/teams'
            },
            {
              text: 'Edit'
            }
          ]
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

          description: Joi.string()
            .label('Description')
            .meta({ component: 'textareaField' })
            .optional()
            .empty('')
            .max(256)
            .messages({
              'string.max': validation.maxCharacters(256)
            }),

          serviceCode: Joi.string()
            .label('Service Code')
            .description('A service code consists of 3 uppercase letters')
            .optional()
            .empty('')
            .min(3)
            .max(3)
            .regex(/^[A-Z]+$/)
            .messages({
              'string.min': validation.exactLetters(3),
              'string.max': validation.exactLetters(3),
              'string.pattern.base': 'Provide 3 uppercase letters'
            }),

          alertEmailAddresses: csvArray
            .array()
            .label('Alert Emails')
            .description('Comma separated list of email addresses')
            .items(Joi.string().email())
            .optional()
            .empty(''),

          alertEnvironments: Joi.array()
            .label('Alert Environments')
            .items(
              ...environments.map((env) =>
                Joi.string().valid(env).label(formatText(env))
              )
            )
            .optional()
        })
      },
      actions: {
        submit: {
          text: 'Update',
          async method(request, h, sanitisedFormValues) {
            const teamId = request.params.teamId

            try {
              await editTeam(request, teamId, {
                name: sanitisedFormValues.name,
                description: sanitisedFormValues.description,
                serviceCodes: sanitisedFormValues.serviceCode
                  ? [sanitisedFormValues.serviceCode]
                  : [],
                alertEmailAddresses: sanitisedFormValues.alertEmailAddresses,
                alertEnvironments: sanitisedFormValues.alertEnvironments
              })

              request.yar.flash(sessionNames.notifications, {
                text: 'Team updated',
                type: 'success'
              })

              return h.redirect(`/admin/teams/${teamId}`)
            } catch (error) {
              request.yar.flash(
                sessionNames.globalValidationFailures,
                error.message
              )

              return h.redirect('/admin/teams/summary')
            }
          }
        },
        cancel: {
          text: 'Cancel',
          method(request, h) {
            return h.redirect(`/admin/teams/${request.params.teamId}`)
          }
        }
      }
    }
  }
}

const csvArray = Joi.extend({
  type: 'array',
  base: Joi.array(),
  coerce: {
    from: 'string',
    method(value) {
      return typeof value === 'string'
        ? { value: value.split(/\s*,\s*/) }
        : undefined
    }
  }
})
