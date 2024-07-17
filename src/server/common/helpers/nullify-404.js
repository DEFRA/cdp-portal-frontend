function nullify404(error) {
  if (error.output.statusCode === 404) {
    return null
  }

  throw error
}

export { nullify404 }
