import { teamFixture } from '~/src/__fixtures__/team'
import { teamRepositories } from '~/src/server/teams/transformers/team-repositories'

describe('#teamRepositories', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(teamRepositories(teamFixture.repositories)).toEqual([
      {
        content: {
          html: `<a class="app-link" href="https://github.com/DEFRA/cdp-portal-backend" target="_blank">cdp-portal-backend</a>`
        }
      },
      {
        content: {
          html: `<a class="app-link" href="https://github.com/DEFRA/cdp-portal-frontend" target="_blank">cdp-portal-frontend</a>`
        }
      }
    ])
  })
})
