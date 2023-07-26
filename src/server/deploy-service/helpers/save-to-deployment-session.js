/**
 *
 * @param yar - yar request session helper
 * @param {Object} valueObj - The deployment multistep form payload
 * @param {string} [valueObj.imageName] - The deployment imageName.
 * @param {string} [valueObj.version] - The deployment version.
 * @param {string} [valueObj.environment] - The environment to be deployed to.
 * @param {number} [valueObj.instanceCount] - The deployment instance count.
 * @param {number} [valueObj.cpu] - The deployment cpu value.
 * @param {number} [valueObj.memory] - The deployment memory value.
 * @param {boolean} [valueObj.isSent] - If the deployment has been sent.
 * @param {boolean} [valueObj.isComplete] - If the deployment is complete.
 */
function saveToDeploymentSession({ yar }, valueObj) {
  const key = 'deployment'
  const deploymentSession = yar.get(key)

  yar.set(key, { ...deploymentSession, ...valueObj })
}

export { saveToDeploymentSession }
