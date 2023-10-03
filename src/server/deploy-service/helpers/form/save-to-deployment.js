import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 *
 * @param yar - yar request session helper
 * @param h
 * @param valueObj
 *
 * @typedef {Object} valueObj - The deployment multistep form payload
 * @property {string} [valueObj.imageName] - The deployment imageName.
 * @property {string} [valueObj.version] - The deployment version.
 * @property {string} [valueObj.environment] - The environment to be deployed to.
 * @property {number} [valueObj.instanceCount] - The deployment instance count.
 * @property {number} [valueObj.cpu] - The deployment cpu value.
 * @property {number} [valueObj.memory] - The deployment memory value.
 *
 * @typedef {Object} valueObj.isComplete - Steps object
 * @property {boolean} valueObj.isComplete.stepOne
 * @property {boolean} valueObj.isComplete.stepTwo
 * @property {boolean} valueObj.isComplete.stepThree
 * @property {boolean} valueObj.isComplete.stepFour
 * @property {boolean} valueObj.isComplete.allSteps
 *
 * @returns {Promise<*>}
 */
async function saveToDeployment({ yar }, h, valueObj) {
  const key = sessionNames.deployment
  const deployment = yar.get(key)

  yar.set(key, { ...deployment, ...valueObj })
  await yar.commit(h)
}

export { saveToDeployment }
