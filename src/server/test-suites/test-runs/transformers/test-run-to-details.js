import { buildList } from '#server/common/helpers/view/build-list.js'
import { renderTag } from '#server/common/helpers/view/render-tag.js'
import { noValue } from '#server/common/constants/no-value.js'
import { buildLink } from '#server/common/helpers/view/build-link.js'
import { pluralise, sanitiseUser } from '#config/nunjucks/filters/filters.js'

export function transformTestRunToDetails(testRun, entity) {
  const teams = buildTeamsLinks(entity)

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Test suite name' },
        value: {
          html: buildLink({
            href: `/test-suites/${testRun.testSuite}`,
            text: testRun.testSuite,
            newTab: false
          })
        }
      },
      {
        key: { text: 'Version' },
        value: {
          html: testRun.tag
            ? buildLink({
                href: `https://github.com/DEFRA/${testRun.testSuite}/releases/tag/${testRun.tag}`,
                text: testRun.tag
              })
            : noValue
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: testRun.environment ?? noValue }
      },
      {
        key: { text: 'Kind' },
        value: {
          html: `<div class="app-!-layout-centered">
                  ${renderTag({ text: `${entity.subType}` })}
                </div>`
        }
      },
      {
        key: { text: 'Profile' },
        value: { text: testRun.profile ?? noValue }
      },
      {
        key: { text: 'Test runner size' },
        value: {
          text: testRun.cpu !== 16384 ? 'Regular' : 'Large'
        }
      },
      {
        key: { text: 'CPU' },
        value: {
          text: testRun.cpu ? `${testRun.cpu / 1024} vCPU` : noValue
        }
      },
      {
        key: { text: 'Memory' },
        value: {
          text: testRun.memory ? `${testRun.memory / 1024} GB` : noValue
        }
      },
      {
        key: { text: 'Run Type' },
        value: {
          text: runType(testRun)
        }
      },
      {
        key: { text: 'Run By' },
        value: runBy(testRun)
      },
      {
        key: { text: pluralise('Team', teams?.length) },
        value: {
          html: teams?.length ? buildList({ items: teams }) : noValue
        }
      }
    ]
  }
}

function runType({ user, deployment }) {
  if (!user?.displayName) {
    return 'Unknown'
  }
  if (deployment?.deploymentId) {
    return 'Auto Triggered'
  }
  if (user?.displayName?.toLowerCase()?.includes('schedule')) {
    return 'Scheduled'
  }
  return 'Manual'
}

function runBy({ user, deployment, environment }) {
  if (deployment) {
    return {
      html: buildLink({
        href: `/deployments/${environment}/${deployment.deploymentId}`,
        text: `${deployment.service} v${deployment.version}`
      })
    }
  }
  if (user?.displayName?.toLowerCase()?.includes('schedule')) {
    return { text: noValue }
  }
  return {
    text: sanitiseUser(user?.displayName)
  }
}

function buildTeamsLinks(entity) {
  return entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) =>
      buildLink({
        href: `/teams/${team.teamId}`,
        text: team.name,
        newTab: false
      })
    )
}
