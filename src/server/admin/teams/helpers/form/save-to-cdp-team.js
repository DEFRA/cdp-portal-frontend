import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 * @param yar
 * @param h
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
 * @typedef {Object} valueObj.isComplete - Steps object
 * @property {boolean} valueObj.isComplete.stepOne
 * @property {boolean} valueObj.isComplete.stepTwo
 * @property {boolean} valueObj.isComplete.stepThree
 * @property {boolean} valueObj.isComplete.allSteps
 * @property {boolean} valueObj.isEdit
 *
 * @returns {Promise<*>}
 */
async function saveToCdpTeam({ yar }, h, valueObj) {
  const key = sessionNames.cdpTeam
  const cdpTeam = yar.get(key)

  yar.set(key, { ...cdpTeam, ...valueObj })
  await yar.commit(h)

  return yar.get(key)
}

export { saveToCdpTeam }
