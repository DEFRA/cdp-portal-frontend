function provideDeploymentStatusClassname(status) {
  switch (true) {
    case status?.toLowerCase() === 'running':
    case status?.toLowerCase() === 'deployed':
      return 'govuk-tag--green'
    case status?.toLowerCase() === 'failed':
      return 'govuk-tag--red'
    case status?.toLowerCase() === 'pending':
      return 'govuk-tag--blue'
    case status?.toLowerCase() === 'requested':
      return 'govuk-tag--purple'
    case status?.toLowerCase() === 'stopped':
    case status?.toLowerCase() === 'un-deployed':
      return 'govuk-tag--grey'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideDeploymentStatusClassname }
