import { sessionNames } from '~/src/server/common/constants/session-names.js'

/**
 * @typedef {object} Steps - Steps object
 * @property {boolean} stepOne
 * @property {boolean} stepTwo
 * @property {boolean} stepThree
 * @property {boolean} allSteps
 * @property {boolean} isEdit
 */

/**
 * @typedef {object} User - The user to add
 * @property {string} name - The users name
 * @property {string} email - The users email
 * @property {string} userId - The users userId
 */

/**
 * @typedef {object} Data - The cdp-team used with the form
 * @property {string} name - The teams name
 * @property {string} [description] - The teams description
 * @property {User[]} usersToAdd - The users selected for addition to the team
 * @property {Steps} isComplete
 */

/**
 * Session for cdp team multistep form
 * @param {import('@hapi/yar').Yar} yar
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {Data} data
 * @returns {Promise<*>}
 */
async function saveToCdpTeam({ yar }, h, data) {
  const key = sessionNames.cdpTeam
  const cdpTeam = yar.get(key)

  yar.set(key, { ...cdpTeam, ...data })
  await yar.commit(h)

  return yar.get(key)
}

export { saveToCdpTeam }
