import { config } from '~/src/config/config.js'

const keyPrefix = config.get('featureToggles.keyPrefix')

async function findFeatureToggle(featureToggles, toggleName) {
  const key = keyPrefix + toggleName
  const enabled = await featureToggles.get(key + ':enabled')
  const created = await featureToggles.get(key + ':created')
  if (enabled == null) {
    return null
  }
  return {
    enabled: enabled === 'true',
    created
  }
}

async function isFeatureToggleEnabled(featureToggles, toggleName) {
  const toggle = await findFeatureToggle(featureToggles, toggleName)
  return toggle ? toggle.enabled : false
}

async function enableFeatureToggle(
  featureToggles,
  toggleName,
  created = new Date().toISOString()
) {
  const key = keyPrefix + toggleName
  await featureToggles.set(key + ':enabled', 'true')
  await featureToggles.set(key + ':created', created)
}

async function removeFeatureToggle(featureToggles, toggleName) {
  const key = keyPrefix + toggleName
  await featureToggles.drop(key + ':enabled')
  await featureToggles.drop(key + ':created')
}

export {
  findFeatureToggle,
  isFeatureToggleEnabled,
  enableFeatureToggle,
  removeFeatureToggle
}
