/**
 * @typedef {object} Options
 * @property {string} id
 * @property {StepData} data
 * @property {string} path
 * @param {import('@hapi/yar').Yar} yar
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @property {import('pino').Logger} logger
 * @property {Function} getStepByPath
 */
/**
 * Save the current step data to the session and set the step as complete
 * @param {Options} options
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
 * Save step data request helper
 * @param {import('@hapi/hapi').Request} request
 * @param {Function} getStepByPath
 * @returns {function(*, *, *): Promise<void>}
 */
function saveStepDataRequestHelper(request, getStepByPath) {
  /**
   * Save step data request helper
   * @param {string} id
   * @param {object} data
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  return (id, data, h) =>
    saveStepData({
      id,
      data,
      path: request.path,
      h,
      yar: request.yar,
      logger: request.logger,
      getStepByPath
    })
}

export { saveStepDataRequestHelper }
