import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

function transformRunningServiceToSummary(serviceName, teams) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Service' },
        value: {
          html: buildLink(`/services/${serviceName}`, serviceName, false)
        }
      },
      {
        key: { text: pluralise('Team', teams.length) },
        value: {
          html: teams.length
            ? buildList(
                teams.map((team) =>
                  buildLink(`/teams/${team.teamId}`, team.name, false)
                )
              )
            : noValue
        }
      }
    ]
  }
}

export { transformRunningServiceToSummary }
