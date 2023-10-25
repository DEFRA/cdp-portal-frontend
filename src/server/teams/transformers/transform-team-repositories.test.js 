import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamRepositories } from '~/src/server/teams/transformers/transform-team-repositories'

describe('#transformTeamRepositories', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(transformTeamRepositories(teamFixture.repositories)).toEqual([
      {
        content: {
          html: '<a class="app-link" href="https://github.com/defra-cdp-sandpit/cdp-portal-backend" target="_blank">defra-cdp-sandpit/cdp-portal-backend</a>'
        }
      },
      {
        content: {
          html: '<a class="app-link" href="https://github.com/defra-cdp-sandpit/cdp-portal-frontend" target="_blank">defra-cdp-sandpit/cdp-portal-frontend</a>'
        }
      }
    ])
  })
})
