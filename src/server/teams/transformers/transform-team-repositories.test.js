import { config } from '~/src/config'
import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamRepositories } from '~/src/server/teams/transformers/transform-team-repositories'

const githubOrg = config.get('githubOrg')

describe('#transformTeamRepositories', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(transformTeamRepositories(teamFixture.repositories)).toEqual([
      {
        content: {
          html: `<a class="app-link" href="https://github.com/${githubOrg}/cdp-portal-backend" target="_blank">${githubOrg}/cdp-portal-backend</a>`
        }
      },
      {
        content: {
          html: `<a class="app-link" href="https://github.com/${githubOrg}/cdp-portal-frontend" target="_blank">${githubOrg}/cdp-portal-frontend</a>`
        }
      }
    ])
  })
})
