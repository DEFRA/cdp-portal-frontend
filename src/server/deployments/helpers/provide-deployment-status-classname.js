function provideDeploymentStatusClassname(status) {
  switch (status) {
    case 'running':
      return 'govuk-tag--green'
    case 'stopping':
    case 'pending':
      return 'govuk-tag--blue'
    case 'requested':
      return 'govuk-tag--purple'
    case 'stopped':
      return 'govuk-tag--grey'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideDeploymentStatusClassname }
