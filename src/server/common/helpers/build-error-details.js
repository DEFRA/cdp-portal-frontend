function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      ...Object.fromEntries(
        detail.path
          .filter((path) => typeof path === 'string')
          .map((path) => [
            path,
            {
              message: detail.message
            }
          ])
      ),
      ...errors
    }
  }, {})
}

export { buildErrorDetails }
