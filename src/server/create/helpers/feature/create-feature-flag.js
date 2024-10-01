function isCreateFeatureTemporaryDisabled() {
  return true
}

function isCreateFeatureEnabled() {
  return !isCreateFeatureTemporaryDisabled()
}

export { isCreateFeatureEnabled, isCreateFeatureTemporaryDisabled }
