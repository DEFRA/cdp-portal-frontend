import startCase from 'lodash/startCase.js'

import { formatDistance, parseISO } from 'date-fns'

import { provideTestRunStatusClassname } from '../helpers/provide-test-run-status-classname.js'
import { buildLogsLink } from '../helpers/build-logs-link.js'
import { formatText } from '../../../config/nunjucks/filters/filters.js'
import { buildLink } from '../../common/helpers/view/build-link.js'
import { taskStatus, testStatus } from '../constants/test-run-status.js'

function getDuration({ created, taskLastUpdated }, hasResult) {
  if (created && taskLastUpdated && hasResult) {
    return formatDistance(parseISO(created), parseISO(taskLastUpdated))
  }

  return null
}

function testSuiteRunResults(testRun, canRun) {
  const runTaskStatus = testRun.taskStatus?.toLowerCase()
  const runTestStatus = testRun.testStatus?.toLowerCase()
  const inProgressStatus = [
    taskStatus.starting,
    taskStatus.inProgress,
    taskStatus.stopping
  ]

  const hasResult =
    runTestStatus === testStatus.passed || runTestStatus === testStatus.failed
  const inProgress = inProgressStatus.includes(runTaskStatus)

  const resultUrl = hasResult
    ? `/test-suites/test-results/${testRun.environment}/${testRun.tag}/${testRun.testSuite}/${testRun.runId}/index.html`
    : ''

  const logsLinkDataAvailable = [
    testRun.environment,
    testRun.taskArn,
    testRun.created,
    testRun.taskLastUpdated
  ].every(Boolean)

  const buildTriggeredByLink = (runInfo) => `
    Deployment of ${buildLink({ href: `/deployments/${runInfo.environment}/${runInfo.deployment.deploymentId}`, text: `${runInfo.deployment.service} v${runInfo.deployment.version}` })}`

  const user = testRun.deployment?.deploymentId
    ? buildTriggeredByLink(testRun)
    : testRun.user.displayName

  return {
    runId: testRun.runId,
    testSuite: testRun.testSuite,
    version: testRun.tag,
    environment: startCase(testRun.environment),
    cpu: testRun.cpu / 1024 + ' vCPU',
    memory: testRun.memory / 1024 + ' GB',
    profile: testRun.profile,
    status: {
      value: testRun.taskStatus ? formatText(testRun.taskStatus) : null,
      classes: provideTestRunStatusClassname(testRun.taskStatus),
      showLoader: inProgress
    },
    logs: {
      available: logsLinkDataAvailable,
      value: logsLinkDataAvailable
        ? `https://logs.${testRun.environment}.cdp-int.defra.cloud`
        : null,
      url: logsLinkDataAvailable && buildLogsLink(testRun, hasResult)
    },
    hasResult,
    resultUrl,
    runTestStatus,
    runTaskStatus,
    user,
    duration: getDuration(testRun, hasResult),
    lastRun: testRun.taskLastUpdated,
    stopAction: {
      available: canRun && runTaskStatus === taskStatus.inProgress,
      url: `/test-suites/${testRun.testSuite}/${testRun.runId}/stop`
    }
  }
}

export { testSuiteRunResults }
