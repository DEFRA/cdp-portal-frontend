import startCase from 'lodash/startCase.js'
import { formatDistance, parseISO } from 'date-fns'

import {
  taskStatus,
  testStatus
} from '~/src/server/test-suites/constants/test-run-status.js'
import { provideTestRunStatusClassname } from '~/src/server/test-suites/helpers/provide-test-run-status-classname.js'
import { buildLogsLink } from '~/src/server/test-suites/helpers/build-logs-link.js'
import { getTestStatusIcon } from '~/src/server/test-suites/helpers/get-test-status-icon.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'

function getDuration({ created, taskLastUpdated }, hasResult) {
  if (created && taskLastUpdated && hasResult) {
    return formatDistance(parseISO(created), parseISO(taskLastUpdated))
  }

  return null
}

function testSuiteRunResults(testRun, canRun) {
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
        headers: 'status',
        entity: {
          kind: 'tag',
          value: formatText(testRun.taskStatus),
          classes: provideTestRunStatusClassname(testRun.taskStatus),
          showLoader: inProgress
        }
      },
      {
        headers: 'logs',
        entity: {
          kind: 'link',
          value: logsLinkDataAvailable ? `logs.${testRun.environment}` : null,
          url: logsLinkDataAvailable && buildLogsLink(testRun, hasResult),
          newWindow: true
        }
      },
      {
        headers: 'results',
        isCentered: true,
        classes: 'app-entity-table__cell--owned',
        entity: {
          kind: 'link',
          value: hasResult ? 'Report' : null,
          url: `/test-suites/test-results/${testRun.environment}/${testRun.tag}/${testRun.testSuite}/${testRun.runId}/index.html`,
          icon: getTestStatusIcon(runTestStatus)
        }
      },
      {
        headers: 'user',
        entity: {
          kind: 'text',
          value: testRun.user.displayName
        }
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
