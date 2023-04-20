function getDeploymentStatusClassname(status) {
  switch (true) {
    case status.toLowerCase() === 'deployed':
      return 'govuk-tag--green'
    case status.toLowerCase() === 'failed':
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--grey'
  }
}

export { getDeploymentStatusClassname }
