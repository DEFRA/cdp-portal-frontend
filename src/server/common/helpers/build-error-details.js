function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      ...Object.fromEntries(
        detail.path.map((path) => [
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
