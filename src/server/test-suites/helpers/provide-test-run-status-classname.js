import { taskStatus } from '../constants/test-run-status.js'

function provideTestRunStatusClassname(status) {
  const statusToLowerCase = status?.toLowerCase()

  switch (true) {
    case statusToLowerCase === taskStatus.starting:
      return 'app-tag--purple'
    case statusToLowerCase === taskStatus.inProgress:
      return 'govuk-tag--light-blue'
    case statusToLowerCase === taskStatus.stopping:
      return 'govuk-tag--turquoise'
    case statusToLowerCase === taskStatus.finished:
      return 'govuk-tag--green'
    case statusToLowerCase === taskStatus.failed:
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--blue'
  }
}

export { provideTestRunStatusClassname }
