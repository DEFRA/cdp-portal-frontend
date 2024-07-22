function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      [detail.context.key]: {
        message: detail.message
      },
      ...errors
    }
  }, {})
}

function reduceErrorMessages(validationResult) {
  return validationResult.error?.details?.map((error) => error.message)
}

export { buildErrorDetails, reduceErrorMessages }
