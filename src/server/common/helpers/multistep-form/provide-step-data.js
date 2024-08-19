const provideStepData = {
  method: (request) => {
    const stepData = request.yar.get(request.app?.multiStepFormId)

    request.logger.debug(
      stepData,
      `Multistep Form Id: ${request.app?.multiStepFormId}`
    )

    return stepData
  },
  assign: 'stepData'
}

export { provideStepData }
