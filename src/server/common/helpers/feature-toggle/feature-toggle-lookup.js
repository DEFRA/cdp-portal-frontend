import { config } from '~/src/config'

const keyPrefix = config.get('featureToggles.keyPrefix')

function isFeatureToggleEnabled(featureToggles, toggleName) {
  //   return findFeatureToggle.call(featureToggles, toggleName) === 'true'
  const toggle = featureToggles.get(keyPrefix + toggleName)
  return toggle != null && toggle === 'true'
}

function enableFeatureToggle(featureToggles, toggleName) {
  //   featureToggles[keyPrefix + toggleName] = 'true'
  featureToggles.set(keyPrefix + toggleName, 'true')
}

function removeFeatureToggle(featureToggles, toggleName) {
  featureToggles.drop(keyPrefix + toggleName)
}

export { isFeatureToggleEnabled, enableFeatureToggle, removeFeatureToggle }
