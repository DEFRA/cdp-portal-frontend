import { config } from '~/src/config'

const keyPrefix = config.get('featureToggles.keyPrefix')

function findFeatureToggle(featureToggles, toggleName) {
  return featureToggles[keyPrefix + toggleName]
}

function isFeatureToggleEnabled(featureToggles, toggleName) {
  return findFeatureToggle.call(featureToggles, toggleName) === 'true'
}

export { isFeatureToggleEnabled }
