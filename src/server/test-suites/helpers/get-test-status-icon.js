import { testStatus } from '../constants/test-run-status.js'
import { renderIcon } from '../../common/helpers/nunjucks/render-component.js'

function getTestStatusIcon(runTestStatus) {
  switch (runTestStatus) {
    case testStatus.passed:
      return renderIcon('tick-icon', {
        classes: 'app-icon--small',
        description: 'Test passed'
      })
    case testStatus.failed:
      return renderIcon('error-icon', {
        classes: 'app-icon--small',
        description: 'Test failed'
      })
    default:
      return null
  }
}

export { getTestStatusIcon }
