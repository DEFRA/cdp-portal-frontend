// TODO this needs to be passed as a generic
/**
 * Deployment step data
 * @typedef {Object} StepData
 * @property {string} id multistep form id
 * @property {string} imageName deployments image name
 * @property {string} version deployments version
 * @property {string} environment deployments environment
 * @property {string} instanceCount deployments instanceCount
 * @property {string} cpu deployments cpu
 * @property {string} memory deployments memory
 * @property {Record<string, boolean>} isComplete map for steps marked complete
 * @property {string} button form button name, one of "save", "next" or if not js, "search"
 * @property {string} [redirectLocation] the path to redirect to, if present this is "summary"
 */

/**
 * Save the current step data to the session and set the step as complete
 * @param {string} id
 * @param {StepData} data
 * @param {string} path
 * @param {ResponseToolkit} h
 * @param {Yar} yar
 * @param {Logger} logger
 * @param {function} getStepByPath
 * @returns {Promise<void>}
 */
async function saveStepData({ id, data, path, h, yar, logger, getStepByPath }) {
  const step = getStepByPath(path)

  if (!step) {
    throw new Error(
      'Could not find step, check multistep urls are set up correctly'
    )
  }

  const stepData = yar.get(id) ?? {}

  logger.debug(`Saving multistep data for step: ${step} with id: ${id}`)

  yar.set(id, {
    id,
    ...stepData,
    ...data,
    ...{
      isComplete: {
        ...(stepData.isComplete ? stepData.isComplete : {}),
        [step]: true
      }
    }
  })
  await yar.commit(h)
}

/**
 *Save step data decorator
 * @param {Request} request
 * @returns {function(id: {string}, data: {object}, h: {ResponseToolkit}, getStepByPath: {function}): Promise<void>}
 */
function saveStepDataDecorator(request) {
  return (id, data, h, getStepByPath) => {
    return saveStepData({
      id,
      data,
      path: request.path,
      h,
      yar: request.yar,
      logger: request.logger,
      getStepByPath
    })
  }
}

export { saveStepDataDecorator }

/**
 * @import {Request, ResponseToolkit} from '@hapi/hapi'
 * @import {Yar} from '@hapi/yar'
 * @import {Logger} from 'pino'
 */
