import { config } from '~/src/config'
import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row'
import { templatesFixture } from '~/src/__fixtures__/templates'

const githubOrg = config.get('githubOrg')

describe('#utilityToEntityRow', () => {
  test('Should provide expected "templates" transformation', () => {
    expect(
      utilityToEntityRow('templates')(templatesFixture.templates.at(0))
    ).toEqual([
      {
        kind: 'link',
        url: '/utilities/templates/cdp-node-frontend-template',
        value: 'cdp-node-frontend-template'
      },
      {
        kind: 'list',
        value: [
          {
            kind: 'link',
            url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Platform'
          }
        ]
      },
      {
        kind: 'text',
        value: 'JavaScript'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/${githubOrg}/cdp-node-frontend-template`,
        value: `${githubOrg}/cdp-node-frontend-template`
      },
      {
        kind: 'date',
        value: '2023-04-26T15:27:09+00:00'
      }
    ])
  })
})
