import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamTemplates } from '~/src/server/teams/transformers/transform-team-templates'

describe('#transformTeamTemplates', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(transformTeamTemplates(teamFixture.templates)).toEqual([
      {
        content: {
          html: '<a class="app-link" href="https://github.com/DEFRA/cdp-node-backend-template" target="_blank">DEFRA/cdp-node-backend-template</a>'
        }
      },
      {
        content: {
          html: '<a class="app-link" href="https://github.com/DEFRA/cdp-node-frontend-template" target="_blank">DEFRA/cdp-node-frontend-template</a>'
        }
      }
    ])
  })
})
