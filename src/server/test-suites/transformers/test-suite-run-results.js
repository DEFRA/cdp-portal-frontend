import { startCase } from 'lodash'
import { formatDistance, parseISO } from 'date-fns'

import {
  taskStatus,
  testStatus
} from '~/src/server/test-suites/constants/test-run-status'
import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname'
import { renderIcon } from '~/src/server/common/helpers/render-component'
import { buildLogsLink } from '~/src/server/test-suites/helpers/build-logs-link'

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
  const runTaskStatus = testRun.taskStatus?.toLowerCase()
  const runTestStatus = testRun.testStatus?.toLowerCase()

  const hasResult =
    runTestStatus === testStatus.passed || runTestStatus === testStatus.failed
  const inProgress =
    runTaskStatus === taskStatus.starting ||
    runTaskStatus === taskStatus.inProgress

  const duration = formatDistance(
    parseISO(testRun.created),
    parseISO(testRun.taskLastUpdated)
  )

  return [
    {
      kind: 'link',
      value: testRun.tag,
      url: `https://github.com/DEFRA/${testRun.testSuite}/releases/tag/${testRun.tag}`,
      newWindow: true
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
      kind: 'link',
      value: `logs.${testRun.environment}`,
      url: buildLogsLink(testRun),
      newWindow: true
    },
    {
      kind: 'link',
      value: hasResult ? 'Report' : null,
      url: `/test-suites/test-results/${testRun.environment}/${testRun.testSuite}/${testRun.runId}`,
      newWindow: true,
      icon: getTestStatusIcon(runTestStatus)
    },
    {
      kind: 'text',
      value: testRun.user.displayName
    },
    { kind: 'text', value: duration },
    { kind: 'date', value: testRun.taskLastUpdated }
  ]
}

export { transformTestSuiteRunResults }
