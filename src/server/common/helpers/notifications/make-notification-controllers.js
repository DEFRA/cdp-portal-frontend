import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { testNotificationValidation } from '#server/test-suites/helpers/schema/test-suite-validation.js'
import {
  createNotificationRule,
  deleteNotificationRule,
  fetchNotificationRule,
  fetchNotificationRules,
  fetchSupportedNotifications,
  testNotificationRule,
  updateNotificationRule
} from '#server/common/helpers/fetch/fetch-notifications.js'

// ── pure helpers ──────────────────────────────────────────────────────────────

function buildEventAndEnvOptions(
  notificationTypes,
  environments,
  selectedEventType
) {
  const eventEnvironments = notificationTypes.find(
    (type) => type.eventType === selectedEventType
  ).environments
  const validEnvironments = environments.filter((env) =>
    eventEnvironments.includes(env)
  )
  const environmentOptions = buildOptions(
    validEnvironments.map((env) => ({ text: formatText(env), value: env })),
    false
  )
  const eventTypeOptions = buildOptions(
    notificationTypes.map((type) => ({
      value: type.eventType,
      text: type.eventType
    })),
    false
  )
  return { validEnvironments, environmentOptions, eventTypeOptions }
}

// ── factory ───────────────────────────────────────────────────────────────────

/**
 * @param {{ basePath: string, entityLabel: string, defaultEventType: string, breadcrumbRoot: {text: string, href: string}, views: {list: string, remove: string, update: string, test: string} }} config
 */
function makeNotificationControllers(config) {
  const { basePath, entityLabel, defaultEventType, breadcrumbRoot, views } =
    config

  function breadcrumbs(...extra) {
    return [breadcrumbRoot, ...extra]
  }

  // ── list ───────────────────────────────────────────────────────────────────

  const list = {
    options: {
      id: `${basePath}/{serviceId}/notifications`,
      validate: {
        query: Joi.object({ eventType: Joi.string().optional() }).unknown(),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = entity.name
      const formValues = { ...request.pre.formValues }
      const userSession = request.auth.credentials
      const environments = getEnvironments(userSession?.scope, entity?.subType)

      if (!formValues.eventType) {
        formValues.eventType = defaultEventType
      }

      const [rows, notificationTypes] = await Promise.all([
        fetchNotificationRules(entityName).then((notifications) =>
          notifications.map((n) => ({
            id: n.ruleId,
            eventType: n.eventType,
            channel: n.slackChannel,
            enabled: n.isEnabled,
            envs: environments.map((env) => ({
              id: env.toLowerCase(),
              selected: n.environments.includes(env)
            }))
          }))
        ),
        fetchSupportedNotifications(entityName)
      ])

      const { environmentOptions, eventTypeOptions } = buildEventAndEnvOptions(
        notificationTypes,
        environments,
        formValues.eventType
      )

      const supportVerticalHeadings = environments.length >= 5

      return h.view(views.list, {
        pageTitle: `${entityLabel} - ${entityName} - Notifications`,
        entity,
        formValues,
        eventTypeOptions,
        environmentOptions,
        tableData: {
          headers: [
            { id: 'eventType', text: 'Event', width: '10' },
            { id: 'channel', text: 'Slack channel', width: '12' },
            ...environments.map((env) => ({
              ...(supportVerticalHeadings && { verticalText: true }),
              id: env.toLowerCase(),
              text: formatText(env),
              width: env.length
            })),
            { id: 'status', text: 'Status', width: '6' },
            {
              id: 'actions',
              text: 'Actions',
              isRightAligned: true,
              width: '12'
            }
          ],
          rows,
          noResult: 'Currently you have no notifications setup'
        },
        breadcrumbs: breadcrumbs(
          { text: entityName, href: `/${basePath}/${entityName}` },
          { text: 'Notifications' }
        )
      })
    }
  }

  const listRefresh = {
    handler: async (request, h) => {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: request.payload
      })
      return h.redirect(
        request.routeLookup(`${basePath}/{serviceId}/notifications`, {
          params: { serviceId: request.params.serviceId }
        })
      )
    }
  }

  // ── create ─────────────────────────────────────────────────────────────────

  const create = {
    options: {
      id: `post:${basePath}/{serviceId}/notifications/create`,
      validate: {
        params: Joi.object({ serviceId: Joi.string().required() }),
        failAction: () => Boom.boomify(Boom.badRequest())
      }
    },
    handler: async (request, h) => {
      const userSession = request.auth.credentials
      const payload = request.payload
      const serviceId = request.params.serviceId

      const sanitisedPayload = {
        eventType: payload.eventType,
        environments: Array.isArray(payload.environments)
          ? payload.environments
          : [payload.environments].filter(Boolean),
        channel: payload.channel
      }

      const environments = getEnvironments(userSession?.scope)
      const notificationTypes = await fetchSupportedNotifications(serviceId)
      const { validEnvironments } = buildEventAndEnvOptions(
        notificationTypes,
        environments,
        sanitisedPayload.eventType
      )

      const validationResult = testNotificationValidation(
        notificationTypes.map((type) => type.eventType),
        validEnvironments
      ).validate(sanitisedPayload, { abortEarly: false })

      if (validationResult?.error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload,
          formErrors: buildErrorDetails(validationResult.error.details)
        })
      } else {
        try {
          await createNotificationRule(serviceId, {
            eventType: validationResult.value.eventType,
            environments: validationResult.value.environments,
            slackChannel: validationResult.value.channel
          })
          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: 'Notification saved successfully',
            type: 'success'
          })
        } catch (error) {
          request.logger.error({ error }, 'Add Notification failed')
          request.yar.flash(sessionNames.validationFailure, {
            formValues: sanitisedPayload
          })
          request.yar.flash(
            sessionNames.globalValidationFailures,
            error.message
          )
        }
      }

      return h.redirect(
        request.routeLookup(`${basePath}/{serviceId}/notifications`, {
          params: { serviceId }
        })
      )
    }
  }

  // ── remove ─────────────────────────────────────────────────────────────────

  const remove = {
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = entity.name
      const notification = await fetchNotificationRule(
        entityName,
        request.params.notificationId
      )
      return h.view(views.remove, {
        pageTitle: `${entityLabel} - ${entityName} - Notifications - Remove`,
        entity,
        notification,
        breadcrumbs: breadcrumbs(
          { text: entityName, href: `/${basePath}/${entityName}` },
          {
            text: 'Notifications',
            href: `/${basePath}/${entityName}/notifications`
          },
          { text: 'Remove' }
        )
      })
    }
  }

  const postRemove = {
    options: {
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required(),
          notificationId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.badRequest())
      }
    },
    handler: async (request, h) => {
      const serviceId = request.params.serviceId
      const notificationId = request.params.notificationId
      try {
        await deleteNotificationRule(serviceId, notificationId)
        request.yar.flash(sessionNames.notifications, {
          text: `Notification removed from ${entityLabel.toLowerCase()}`,
          type: 'success'
        })
      } catch (error) {
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
      return h.redirect(
        request.routeLookup(`${basePath}/{serviceId}/notifications`, {
          params: { serviceId }
        })
      )
    }
  }

  // ── update ─────────────────────────────────────────────────────────────────

  const update = {
    options: {
      id: `${basePath}/{serviceId}/notifications/{notificationId}/update`
    },
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = entity.name
      const userSession = request.auth.credentials
      const environments = getEnvironments(userSession?.scope, entity?.subType)

      const [notification, notificationTypes] = await Promise.all([
        fetchNotificationRule(entityName, request.params.notificationId),
        fetchSupportedNotifications(entityName)
      ])

      const formValues = {
        eventType: notification.eventType,
        environments: notification.environments,
        channel: notification.slackChannel,
        enabled: notification.isEnabled,
        ...request.pre.formValues
      }

      const { environmentOptions, eventTypeOptions } = buildEventAndEnvOptions(
        notificationTypes,
        environments,
        formValues.eventType
      )

      return h.view(views.update, {
        pageTitle: `${entityLabel} - ${entityName} - Notifications - Update`,
        entity,
        notification,
        formValues,
        eventTypeOptions,
        environmentOptions,
        breadcrumbs: breadcrumbs(
          { text: entityName, href: `/${basePath}/${entityName}` },
          {
            text: 'Notifications',
            href: `/${basePath}/${entityName}/notifications`
          },
          { text: 'Update' }
        )
      })
    }
  }

  const updateRefresh = {
    handler: async (request, h) => {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: request.payload
      })
      return h.redirect(
        request.routeLookup(
          `${basePath}/{serviceId}/notifications/{notificationId}/update`,
          {
            params: {
              serviceId: request.params.serviceId,
              notificationId: request.params.notificationId
            }
          }
        )
      )
    }
  }

  const postUpdate = {
    options: {
      id: `${basePath}/{serviceId}/notifications/{notificationId}/update/action`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required(),
          notificationId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.badRequest())
      }
    },
    handler: async (request, h) => {
      const userSession = request.auth.credentials
      const payload = request.payload
      const serviceId = request.params.serviceId
      const notificationId = request.params.notificationId

      const sanitisedPayload = {
        eventType: payload.eventType,
        environments: Array.isArray(payload.environments)
          ? payload.environments
          : [payload.environments].filter(Boolean),
        channel: payload.channel,
        enabled: payload.enabled
      }

      const environments = getEnvironments(userSession?.scope)
      const notificationTypes = await fetchSupportedNotifications(serviceId)
      const { validEnvironments } = buildEventAndEnvOptions(
        notificationTypes,
        environments,
        sanitisedPayload.eventType
      )

      const validationResult = testNotificationValidation(
        notificationTypes.map((type) => type.eventType),
        validEnvironments
      ).validate(sanitisedPayload, { abortEarly: false })

      if (validationResult?.error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload,
          formErrors: buildErrorDetails(validationResult.error.details)
        })
      } else {
        try {
          await updateNotificationRule(serviceId, notificationId, {
            eventType: validationResult.value.eventType,
            environments: validationResult.value.environments,
            slackChannel: validationResult.value.channel,
            isEnabled: validationResult.value.enabled
          })
          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: 'Notification updated successfully',
            type: 'success'
          })
        } catch (error) {
          request.logger.error({ error }, 'Update Notification failed')
          request.yar.flash(sessionNames.validationFailure, {
            formValues: sanitisedPayload
          })
          request.yar.flash(
            sessionNames.globalValidationFailures,
            error.message
          )
        }
      }

      return h.redirect(
        request.routeLookup(`${basePath}/{serviceId}/notifications`, {
          params: { serviceId }
        })
      )
    }
  }

  // ── test ───────────────────────────────────────────────────────────────────

  const testNotification = {
    options: {
      id: `${basePath}/{serviceId}/notifications/{notificationId}/test`
    },
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = entity.name
      const notification = await fetchNotificationRule(
        entityName,
        request.params.notificationId
      )
      return h.view(views.test, {
        pageTitle: `${entityLabel} - ${entityName} - Notifications - Test`,
        entity,
        notification,
        breadcrumbs: breadcrumbs(
          { text: entityName, href: `/${basePath}/${entityName}` },
          {
            text: 'Notifications',
            href: `/${basePath}/${entityName}/notifications`
          },
          { text: 'Test' }
        )
      })
    }
  }

  const postTestNotification = {
    options: {
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required(),
          notificationId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.badRequest())
      }
    },
    handler: async (request, h) => {
      const serviceId = request.params.serviceId
      const notificationId = request.params.notificationId
      try {
        await testNotificationRule(serviceId, notificationId)
        request.yar.flash(sessionNames.notifications, {
          text: 'Test notification sent',
          type: 'success'
        })
        return h.redirect(
          request.routeLookup(
            `${basePath}/{serviceId}/notifications/{notificationId}/test`,
            { params: { serviceId, notificationId } }
          )
        )
      } catch (error) {
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
        return h.redirect(
          request.routeLookup(`${basePath}/{serviceId}/notifications`, {
            params: { serviceId }
          })
        )
      }
    }
  }

  return {
    list,
    listRefresh,
    create,
    remove,
    postRemove,
    update,
    updateRefresh,
    postUpdate,
    testNotification,
    postTestNotification
  }
}

export { makeNotificationControllers }
