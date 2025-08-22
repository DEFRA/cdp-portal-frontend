/**
 * Save the current step data to the session and set the step as complete
 * @param {string} id
 * @param {StepData} data
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @param {import('@hapi/yar').Yar} yar
 * @param {import('pino').Logger} logger
 * @param {Function} getStepByPath
 * @returns {Promise<void>}
 */
async function saveStepData({ id, data, h, yar, logger, step }) {
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
      h,
      yar: request.yar,
      logger: request.logger,
      step: getStepByPath(request)
    })
}

export { saveStepDataRequestHelper }
