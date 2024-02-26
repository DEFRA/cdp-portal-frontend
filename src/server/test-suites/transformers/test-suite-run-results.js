import { startCase } from 'lodash'

import {
  taskStatus,
  testStatus
} from '~/src/server/test-suites/constants/test-run-status'
import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/render-component'

function getTestStatusIcon(runTestStatus) {
  switch (true) {
    case runTestStatus === testStatus.passed:
      return renderIcon('tick-icon', { classes: 'app-icon-small' })
    case runTestStatus === testStatus.failed:
      return renderIcon('error-icon', { classes: 'app-icon-small' })
    default:
      return null
  }
}

function transformTestSuiteRunResults(testRun) {
  const runTaskStatus = testRun.taskStatus.toLowerCase()
  const runTestStatus = testRun.testStatus?.toLowerCase()

  const hasResult =
    runTestStatus === testStatus.passed || runTestStatus === testStatus.failed
  const inProgress =
    runTaskStatus === taskStatus.starting ||
    runTaskStatus === taskStatus.stopping ||
    runTaskStatus === taskStatus.inProgress

  return [
    {
      kind: 'link',
      value: testRun.tag,
      url: `https://github.com/DEFRA/${testRun.service}/releases/tag/${testRun.tag}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: testRun.user.displayName
    },
    {
      kind: 'text',
      value: startCase(testRun.environment)
    },
    {
      kind: 'tag',
      value: testRun.taskStatus,
      classes: provideTestRunStatusClassname(testRun.taskStatus),
      showLoader: inProgress
    },
    {
      kind: 'html',
      value: renderComponent('logs-test-run-link', {
        environment: testRun.environment,
        arn: testRun.taskArn,
        created: testRun.created,
        taskLastUpdated: testRun.taskLastUpdated
      })
    },
    {
      kind: 'link',
      value: hasResult ? 'Report' : null,
      url: `/test-suites/test-results/${testRun.environment}/${testRun.testSuite}/${testRun.runId}`,
      newWindow: true,
      icon: getTestStatusIcon(runTestStatus)
    },
    { kind: 'date', value: testRun.taskLastUpdated },
    { kind: 'date', value: testRun.created }
  ]
}

export { transformTestSuiteRunResults }
