import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 *
 * @param yar - yar request session helper
 * @param valueObj
 *
 * @typedef {Object} valueObj - The cdp-user multistep form payload
 * @property {string} valueObj.userId - The AAD User ID
 * @property {string} valueObj.email - The AAD Users email
 * @property {string} [valueObj.github] - The GitHub username
 * @property {string} [valueObj.name] - CDP users name
 * @property {string} [valueObj.defraAwsId] - Defra AWS ID
 * @property {string} [valueObj.defraVpnId] - Defra VPN ID
 */
function saveToCdpUser({ yar }, valueObj) {
  const key = sessionNames.cdpUser
  const cdpUser = yar.get(key)

  yar.set(key, { ...cdpUser, ...valueObj })
}

export { saveToCdpUser }
