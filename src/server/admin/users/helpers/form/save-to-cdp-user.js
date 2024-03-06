import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 * @param yar - yar request session helper
 * @param h
 * @param valueObj
 *
 * @typedef {Object} valueObj - The cdp-user used in the multistep form payload
 * @property {string} valueObj.userId - The AAD User ID
 * @property {string} valueObj.email - The AAD Users email
 * @property {string} [valueObj.github] - The GitHub username
 * @property {string} [valueObj.name] - CDP users name
 * @property {string} [valueObj.defraAwsId] - Defra AWS ID
 * @property {string} [valueObj.defraVpnId] - Defra VPN ID
 *
 * @typedef {Object} valueObj.isComplete - Steps object
 * @property {boolean} valueObj.isComplete.stepOne
 * @property {boolean} valueObj.isComplete.stepTwo
 * @property {boolean} valueObj.isComplete.stepThree
 * @property {boolean} valueObj.isComplete.allSteps
 * @property {boolean} valueObj.isEdit
 *
 * @returns {Promise<*>}
 */
async function saveToCdpUser({ yar }, h, valueObj) {
  const key = sessionNames.cdpUser
  const cdpUser = yar.get(key)

  yar.set(key, { ...cdpUser, ...valueObj })
  await yar.commit(h)

  return yar.get(key)
}

export { saveToCdpUser }
