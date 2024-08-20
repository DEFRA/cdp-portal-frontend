import { sessionNames } from '~/src/server/common/constants/session-names'

/** @typedef {"microservice" | "repository"} Kind */

/**
 * @typedef {object} Data - The item to create
 * @property {Kind} kind
 * @property {Record<string, string>} isComplete - Steps object
 */
/**
 *
 * @param {Yar} yar
 * @param {ResponseToolkit} h
 * @param {Data} data
 * @param {boolean} [overwrite]
 * @returns {Promise<*>}
 */
async function saveToCreate({ yar }, h, data, overwrite = false) {
  const key = sessionNames.create
  const create = yar.get(key)

  if (overwrite) {
    yar.set(key, data)
  } else {
    yar.set(key, { ...create, ...data })
  }

  await yar.commit(h)

  return yar.get(key)
}

export { saveToCreate }

/**
 * @import {ResponseToolkit} from '@hapi/hapi'
 * @import {Yar} from '@hapi/yar'
 */
