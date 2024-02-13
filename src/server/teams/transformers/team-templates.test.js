import { config } from '~/src/config'
import { teamFixture } from '~/src/__fixtures__/team'
import { teamTemplates } from '~/src/server/teams/transformers/team-templates'

const githubOrg = config.get('githubOrg')

describe('#teamTemplates', () => {
  test('Should provide expected team repositories transformation', () => {
    expect(teamTemplates(teamFixture.templates)).toEqual([
      {
        content: {
          html: `<a class="app-link" href="https://github.com/${githubOrg}/cdp-node-backend-template" target="_blank">${githubOrg}/cdp-node-backend-template</a>`
        }
      },
      {
        content: {
          html: `<a class="app-link" href="https://github.com/${githubOrg}/cdp-node-frontend-template" target="_blank">${githubOrg}/cdp-node-frontend-template</a>`
        }
      }
    ])
  })
})
