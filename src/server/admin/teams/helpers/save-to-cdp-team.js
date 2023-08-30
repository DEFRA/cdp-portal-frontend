import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 * @param yar
 * @param valueObj
 *
 * @typedef {Object} userToAdd - The user to add
 * @property {string} userToAdd.name - The users name
 * @property {string} userToAdd.email - The users email
 * @property {string} userToAdd.userId - The users userId
 *
 * @typedef {Object} valueObj - The cdp-team used with the form
 * @property {string} valueObj.name - The teams name
 * @property {string} [valueObj.description] - The teams description
 * @property {Array<userToAdd>} valueObj.usersToAdd - The users selected for addition to the team
 *
 * @returns {*}
 */
function saveToCdpTeam({ yar }, valueObj) {
  const key = sessionNames.cdpTeam
  const cdpTeam = yar.get(key)

  yar.set(key, { ...cdpTeam, ...valueObj })

  return yar.get(key)
}

export { saveToCdpTeam }
