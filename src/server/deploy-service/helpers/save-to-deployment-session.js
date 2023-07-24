/**
 *
 * @param yar - yar request session helper
 * @param {Object} valueObj - The deployment multistep form payload
 * @param {string} [valueObj.imageName] - The service deployment imageName.
 * @param {string} [valueObj.version] - The service deployment version.
 * @param {string} [valueObj.environment] - The service deployment environment to be deployed to.
 * @param {number} [valueObj.instanceCount] - The service deployment instance count.
 * @param {number} [valueObj.cpu] - The service deployment cpu value.
 * @param {number} [valueObj.memory] - The service deployment memory value.
 * @param {boolean} [valueObj.isSent] - If the deployment has been sent.
 * @param {boolean} [valueObj.isComplete] - If the deployment is complete.
 */
function saveToDeploymentSession({ yar }, valueObj) {
  const key = 'deployment'
  const deploymentSession = yar.get(key)

  yar.set(key, { ...deploymentSession, ...valueObj })
}

export { saveToDeploymentSession }
