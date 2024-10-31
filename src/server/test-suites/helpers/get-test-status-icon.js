import { testStatus } from '~/src/server/test-suites/constants/test-run-status.js'
import { renderIcon } from '~/src/server/common/helpers/render-component.js'

function getTestStatusIcon(runTestStatus) {
  switch (runTestStatus) {
    case testStatus.passed:
      return renderIcon('tick-icon', { classes: 'app-icon-small' })
    case testStatus.failed:
      return renderIcon('error-icon', { classes: 'app-icon-small' })
    default:
      return null
  }
}

export { getTestStatusIcon }
