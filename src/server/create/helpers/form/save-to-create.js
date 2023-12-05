import { sessionNames } from '~/src/server/common/constants/session-names'

/**
 * @param yar
 * @param h
 * @param valueObj
 * @param overwrite
 *
 * @typedef {Object} valueObj - The item to create
 * @property {string} valueObj.kind - microservice | repository
 *
 * @typedef {Object} valueObj.isComplete - Steps object
 * @property {boolean} valueObj.isComplete.stepOne
 * @property {boolean} valueObj.isComplete.stepTwo
 * @property {boolean} valueObj.isComplete.stepThree
 * @property {boolean} valueObj.isComplete.allSteps
 *
 * @returns {Promise<*>}
 */
async function saveToCreate({ yar }, h, valueObj, overwrite = false) {
  const key = sessionNames.create
  const create = yar.get(key)

  if (overwrite) {
    yar.set(key, valueObj)
  } else {
    yar.set(key, { ...create, ...valueObj })
  }

  await yar.commit(h)

  return yar.get(key)
}

export { saveToCreate }
