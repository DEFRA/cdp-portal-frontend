function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    const key = detail.path.filter((val) => typeof val === 'string').join('.')
    const value = {
      message: detail.message
    }
    return {
      ...{ [key]: value },
      ...errors
    }
  }, {})
}

export { buildErrorDetails }
