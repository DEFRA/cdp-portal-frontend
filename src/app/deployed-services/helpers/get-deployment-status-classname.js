function getDeploymentStatusClassname(status) {
  switch (true) {
    case status?.toLowerCase() === 'running':
      return 'govuk-tag--green'
    case status?.toLowerCase() === 'failed':
      return 'govuk-tag--red'
    case status?.toLowerCase() === 'pending':
      return 'govuk-tag--purple'
    default:
      return 'govuk-tag--grey'
  }
}

export { getDeploymentStatusClassname }
