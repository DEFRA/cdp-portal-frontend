import { teamFixture } from '~/src/__fixtures__/team'
import { teamTemplates } from '~/src/server/teams/transformers/team-templates'

describe('#teamTemplates', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(teamTemplates(teamFixture.templates)).toEqual([
      {
        content: {
          html: `<a class="app-link" href="https://github.com/DEFRA/cdp-node-backend-template" target="_blank">cdp-node-backend-template</a>`
        }
      },
      {
        content: {
          html: `<a class="app-link" href="https://github.com/DEFRA/cdp-node-frontend-template" target="_blank">cdp-node-frontend-template</a>`
        }
      }
    ])
  })
})
