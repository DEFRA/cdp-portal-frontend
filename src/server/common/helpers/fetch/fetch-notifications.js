import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { removeNil } from '#server/common/helpers/remove-nil.js'

const portalBackendUrl = config.get('portalBackendUrl')

/**
 * Returns a list of all the configured rules for a given entity.
 * @param {string} entityId
 * @return {Promise<{ruleId: string, eventType: string, entity: string, environments: string[], slackChannel: string|null, isEnabled: boolean}[]>}
 */
export async function fetchNotificationRules(entityId) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications`
  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

/**
 * Returns a specific instance of a notification rule by its ruleId
 * @param {string} entityId
 * @param {string} ruleId
 * @return {Promise<{ruleId: string, eventType: string, entity: string, environments: string[], slackChannel: string|null, isEnabled: boolean}|null>}
 */
export async function fetchNotificationRule(entityId, ruleId) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications/${ruleId}`
  const { payload } = await fetchJson(endpoint)
  return payload
}

/**
 * Returns a list of notification types supported by the entity and the environments which each
 * type can be configured in. (e.g. perf-tests limited to just perf-test + admin envs).
 * Portal will still need to filter environments down to just those the user is *allowed* to see.
 * @param {string} entityId
 * @return {Promise<{eventType: string, environments: string[]}[]>}
 */
export async function fetchSupportedNotifications(entityId) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/supported-notifications`
  const { payload } = await fetchJson(endpoint)
  return payload
}

/**
 * Attempts to create a new notification rule for an entity.
 * @param {string} entityId
 * @param {{eventType: string, slackChannel: string, environments: string[], isEnabled: boolean|null}} rule
 * @return {Promise<>}
 */
export async function createNotificationRule(entityId, rule) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications`

  return fetchJson(endpoint, {
    method: 'POST',
    payload: removeNil({
      environments: rule.environments,
      eventType: rule.eventType,
      slackChannel: rule.slackChannel,
      isEnabled: rule.isEnabled
    })
  })
}

/**
 * Deletes a rule for an entity
 * @param {string} entityId
 * @param {string} ruleId
 * @return {Promise<{res: any, error} | {res: any, payload: any}>}
 */
export async function deleteNotificationRule(entityId, ruleId) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications/${ruleId}`

  return fetchJson(endpoint, {
    method: 'DELETE'
  })
}

/**
 * Updates a rule for an entity.
 * This replaces the rule with the new content (except for the entity/ruleId) rather than only updating selected fields.
 * @param {string} entityId
 * @param {string} ruleId
 * @param {{eventType: string, slackChannel: string, environments: string[], isEnabled: boolean|null}} updatedRule
 * @return {Promise<{res: any, error} | {res: any, payload: any}>}
 */
export async function updateNotificationRule(entityId, ruleId, updatedRule) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications/${ruleId}`

  return fetchJson(endpoint, {
    method: 'PUT',
    payload: removeNil({
      environments: updatedRule.environments,
      eventType: updatedRule.eventType,
      slackChannel: updatedRule.slackChannel,
      isEnabled: updatedRule.isEnabled
    })
  })
}

/**
 * Triggers a test message for a rule
 * @param {string} entityId
 * @param {string} ruleId
 * @return {Promise<{res: any, error} | {res: any, payload: any}>}
 */
export async function testNotificationRule(entityId, ruleId) {
  const endpoint = `${portalBackendUrl}/entities/${entityId}/notifications/${ruleId}/test`

  return fetchJson(endpoint, {
    method: 'POST'
  })
}
