import startCase from 'lodash/startCase.js'

import { formatDistance, parseISO } from 'date-fns'

import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname.js'
import { buildLogsLink } from '~/src/server/test-suites/helpers/build-logs-link.js'
import { getTestStatusIcon } from '~/src/server/test-suites/helpers/get-test-status-icon.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import {
  taskStatus,
  testStatus
} from '~/src/server/test-suites/constants/test-run-status.js'

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

  const logsLinkDataAvailable = [
    testRun.environment,
    testRun.taskArn,
    testRun.created,
    testRun.taskLastUpdated
  ].every(Boolean)

  const buildTriggeredByLink = (runInfo) => `
    Deployment of ${buildLink(`/deployments/${runInfo.environment}/${runInfo.deployment.deploymentId}`, `${runInfo.deployment.service} v${runInfo.deployment.version}`)}`

  const user = testRun.deployment?.deploymentId
    ? buildTriggeredByLink(testRun)
    : testRun.user.displayName

  return {
    cells: [
      {
        headers: 'version',
        entity: {
          kind: 'link',
          value: testRun.tag,
          url: `https://github.com/DEFRA/${testRun.testSuite}/releases/tag/${testRun.tag}`,
          newWindow: true
        }
      },
      {
        headers: 'environment',
        entity: {
          kind: 'text',
          value: startCase(testRun.environment)
        }
      },
      {
        headers: 'cpu',
        entity: {
          kind: 'text',
          value: testRun.cpu / 1024 + ' vCPU'
        }
      },
      {
        headers: 'memory',
        entity: {
          kind: 'text',
          value: testRun.memory / 1024 + ' GB'
        }
      },
      {
        headers: 'status',
        entity: {
          kind: 'tag',
          value: testRun.taskStatus ? formatText(testRun.taskStatus) : null,
          classes: provideTestRunStatusClassname(testRun.taskStatus),
          showLoader: inProgress
        }
      },
      {
        headers: 'logs',
        entity: {
          kind: 'link',
          value: logsLinkDataAvailable
            ? `https://logs.${testRun.environment}.cdp-int.defra.cloud`
            : null,
          url: logsLinkDataAvailable && buildLogsLink(testRun, hasResult),
          newWindow: true
        }
      },
      {
        headers: 'results',
        entity: {
          kind: 'link',
          value: hasResult ? 'Report' : null,
          url: `/test-suites/test-results/${testRun.environment}/${testRun.tag}/${testRun.testSuite}/${testRun.runId}/index.html`,
          icon: getTestStatusIcon(runTestStatus)
        }
      },
      {
        headers: 'user',
        html: user
      },
      {
        headers: 'duration',
        entity: { kind: 'text', value: getDuration(testRun, hasResult) }
      },
      {
        headers: 'last-ran',
        entity: { kind: 'date', value: testRun.taskLastUpdated }
      },
      {
        headers: 'action',
        entity: {
          kind: 'button',
          classes: 'app-button--small',
          value:
            canRun && runTaskStatus === taskStatus.inProgress ? 'Stop' : null,
          url: `/test-suites/${testRun.testSuite}/${testRun.runId}/stop`
        }
      }
    ]
  }
}

export { testSuiteRunResults }
