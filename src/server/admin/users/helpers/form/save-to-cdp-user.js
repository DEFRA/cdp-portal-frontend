import { sessionNames } from '../../../../common/constants/session-names.js'

/**
 * @typedef {object} Steps - Steps object
 * @property {boolean} stepOne
 * @property {boolean} stepTwo
 * @property {boolean} stepThree
 * @property {boolean} allSteps
 * @property {boolean} isEdit
 */

/**
 * @typedef {object} Data - The cdp-user used in the multistep form payload
 * @property {string} userId - The AAD User ID
 * @property {string} email - The AAD Users email
 * @property {string} [github] - The GitHub username
 * @property {string} [name] - CDP users name
 * @property {Steps} isComplete
 */

/**
 * Session for cdp user multistep form
 * @param {import('@hapi/yar').Yar} yar
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {Data} data
 * @returns {Promise<*>}
 */
async function saveToCdpUser({ yar }, h, data) {
  const key = sessionNames.cdpUser
  const cdpUser = yar.get(key)

  yar.set(key, { ...cdpUser, ...data })
  return yar.get(key)
}

export { saveToCdpUser }
