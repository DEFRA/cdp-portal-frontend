function augmentStatus({ status, unstable }) {
  if (status === 'stopped' && unstable === true) {
    return 'failed'
  }

  return status
}

export { augmentStatus }
