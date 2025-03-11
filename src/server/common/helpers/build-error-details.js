function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      [detail.path.at(0)]: {
        message: detail.message
      },
      ...errors
    }
  }, {})
}

export { buildErrorDetails }
