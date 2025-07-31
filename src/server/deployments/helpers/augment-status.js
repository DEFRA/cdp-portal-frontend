function augmentStatus(deployment) {
  const status = deployment?.status
  const unstable = deployment?.unstable

  if (status === 'stopped' && unstable === true) {
    return 'failed'
  }

  return status
}

export { augmentStatus }
