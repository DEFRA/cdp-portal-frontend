import { formatDistance, parseISO } from 'date-fns'
import { buildLogsLink } from '#server/test-suites/helpers/build-logs-link.js'
import {
  taskStatus,
  testStatus
} from '#server/test-suites/constants/test-run-status.js'
import {
  renderComponent,
  renderIcon
} from '#server/common/helpers/nunjucks/render-component.js'
import { renderTag } from '#server/common/helpers/view/render-tag.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { provideTestRunStatusClassname } from '#server/test-suites/helpers/provide-test-run-status-classname.js'
import { buildLink } from '#server/common/helpers/view/build-link.js'
import { noValue } from '#server/common/constants/no-value.js'
import { buildPostButton } from '#server/common/helpers/view/build-post-button.js'

function getDuration({ created, taskLastUpdate }, hasResult) {
  if (created && taskLastUpdate && hasResult) {
    return formatDistance(parseISO(created), parseISO(taskLastUpdate))
  }
  return null
}

export function transformTestRunToStatus(canRun, testRun, csrf) {
  const logsLinkDataAvailable = [
    testRun.environment,
    testRun.taskArn,
    testRun.created,
    testRun.taskLastUpdated
  ].every(Boolean)

  const hasResult =
    testRun.testStatus === testStatus.passed ||
    testRun.testStatus === testStatus.failed

  const resultUrl = hasResult
    ? `/test-suites/test-results/${testRun.environment}/${testRun.tag}/${testRun.testSuite}/${testRun.runId}/index.html`
    : ''

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderTag({
            text: formatText(testRun.taskStatus),
            classes: provideTestRunStatusClassname(testRun.taskStatus)
          })
        }
      },
      {
        key: {
          text: 'Action'
        },
        value:
          canRun && testRun.taskStatus === taskStatus.inProgress
            ? {
                html: buildPostButton({
                  action: `/test-suites/${testRun.testSuite}/${testRun.runId}/stop`,
                  text: 'Stop',
                  csrf
                })
              }
            : noValue
      },
      {
        key: { text: 'Result' },
        value: hasResult
          ? testRun.testStatus === testStatus.passed
            ? {
                html: `<div class="app-!-layout-centered">
                  ${buildLink({
                    href: `${resultUrl}`,
                    text: 'Report'
                  })}
                  ${renderIcon('tick-icon', { classes: 'app-icon--small govuk-!-margin-left-1' })}
                </div>`
              }
            : {
                html: `<div class="app-!-layout-centered">
                  ${buildLink({
                    href: `${resultUrl}`,
                    text: 'Report'
                  })}
                  ${renderIcon('error', { classes: 'app-icon--small govuk-!-margin-left-1' })}
                </div>`
              }
          : noValue
      },
      {
        key: { text: 'Test suite logs' },
        value: {
          html: buildLink({
            href: logsLinkDataAvailable && buildLogsLink(testRun, hasResult),
            text: `https://logs.${encodeURI(testRun.environment)}.cdp-int.defra.cloud/`
          })
        }
      },
      {
        key: { text: 'Started' },
        value: {
          html: renderComponent('time', { datetime: testRun.created })
        }
      },
      {
        key: { text: 'Last updated' },
        value: {
          html: renderComponent('time', {
            datetime: testRun.taskLastUpdated
          })
        }
      },
      {
        key: { text: 'Duration' },
        value: { text: getDuration(testRun, hasResult) ?? noValue }
      }
    ]
  }
}
