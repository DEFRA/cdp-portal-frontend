import { config } from '~/src/config'

const keyPrefix = config.get('featureToggles.keyPrefix')

async function isFeatureToggleEnabled(featureToggles, toggleName) {
  const toggle = await featureToggles.get(keyPrefix + toggleName)
  return toggle != null && toggle === 'true'
}

async function enableFeatureToggle(featureToggles, toggleName) {
  await featureToggles.set(keyPrefix + toggleName, 'true')
}

async function removeFeatureToggle(featureToggles, toggleName) {
  await featureToggles.drop(keyPrefix + toggleName)
}

export { isFeatureToggleEnabled, enableFeatureToggle, removeFeatureToggle }
