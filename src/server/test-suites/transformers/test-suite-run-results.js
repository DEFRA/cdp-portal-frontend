import { startCase } from 'lodash'
import { formatDistance, parseISO } from 'date-fns'

import {
  taskStatus,
  testStatus
} from '~/src/server/test-suites/constants/test-run-status'
import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname'
import { buildLogsLink } from '~/src/server/test-suites/helpers/build-logs-link'
import { getTestStatusIcon } from '~/src/server/test-suites/helpers/get-test-status-icon'

function getDuration({ created, taskLastUpdated }, hasResult) {
  if (created && taskLastUpdated && hasResult) {
    return formatDistance(parseISO(created), parseISO(taskLastUpdated))
  }

  return null
}

function transformTestSuiteRunResults(testRun, canRun) {
  const runTaskStatus = testRun.taskStatus?.toLowerCase()
  const runTestStatus = testRun.testStatus?.toLowerCase()

  const hasResult =
    runTestStatus === testStatus.passed || runTestStatus === testStatus.failed
  const inProgress =
    runTaskStatus === taskStatus.starting ||
    runTaskStatus === taskStatus.inProgress

  const logsLinkDataAvailable = [
    testRun.environment,
    testRun.taskArn,
    testRun.created,
    testRun.taskLastUpdated
  ].every(Boolean)

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
      value: logsLinkDataAvailable ? `logs.${testRun.environment}` : null,
      url: logsLinkDataAvailable && buildLogsLink(testRun, hasResult),
      newWindow: true
    },
    {
      kind: 'link',
      value: hasResult ? 'Report' : null,
      url: `/test-suites/test-results/${testRun.environment}/${testRun.tag}/${testRun.testSuite}/${testRun.runId}/index.html`,
      icon: getTestStatusIcon(runTestStatus)
    },
    {
      kind: 'text',
      value: testRun.user.displayName
    },
    { kind: 'text', value: getDuration(testRun, hasResult) },
    { kind: 'date', value: testRun.taskLastUpdated },
    {
      kind: 'button',
      classes: 'app-button--small',
      value: canRun && runTaskStatus === taskStatus.inProgress ? 'Stop' : null,
      url: `/test-suites/${testRun.testSuite}/${testRun.runId}/stop`
    }
  ]
}

export { transformTestSuiteRunResults }
