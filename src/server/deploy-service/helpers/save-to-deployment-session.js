import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 *
 * @param yar - yar request session helper
 * @param valueObj
 *
 * @typedef {Object} valueObj - The deployment multistep form payload
 * @property {string} [valueObj.imageName] - The deployment imageName.
 * @property {string} [valueObj.version] - The deployment version.
 * @property {string} [valueObj.environment] - The environment to be deployed to.
 * @property {number} [valueObj.instanceCount] - The deployment instance count.
 * @property {number} [valueObj.cpu] - The deployment cpu value.
 * @property {number} [valueObj.memory] - The deployment memory value.
 * @property {boolean} [valueObj.isSent] - If the deployment has been sent.
 * @property {boolean} [valueObj.isComplete] - If the deployment is complete.
 */
function saveToDeploymentSession({ yar }, valueObj) {
  const key = sessionNames.deployment
  const deployment = yar.get(key)

  yar.set(key, { ...deployment, ...valueObj })
}

export { saveToDeploymentSession }
