import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamRepositories } from '~/src/server/teams/transformers/transform-team-repositories'

describe('#transformTeamRepositories', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(transformTeamRepositories(teamFixture.repositories)).toEqual([
      {
        content: {
          html: '<a class="app-link" href="https://github.com/DEFRA/cdp-portal-backend" target="_blank">DEFRA/cdp-portal-backend</a>'
        }
      },
      {
        content: {
          html: '<a class="app-link" href="https://github.com/DEFRA/cdp-portal-frontend" target="_blank">DEFRA/cdp-portal-frontend</a>'
        }
      }
    ])
  })
})
