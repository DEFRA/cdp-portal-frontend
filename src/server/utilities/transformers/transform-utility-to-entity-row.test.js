import { config } from '~/src/config'
import { transformUtilityToEntityRow } from '~/src/server/utilities/transformers/transform-utility-to-entity-row'
import { templatesFixture } from '~/src/__fixtures__/templates'

const githubOrg = config.get('githubOrg')

describe('#transformUtilityToEntityRow', () => {
  test('Should provide expected "templates" transformation', () => {
    expect(
      transformUtilityToEntityRow('templates')(templatesFixture.templates.at(0))
    ).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/utilities/templates/cdp-node-frontend-template',
        value: 'cdp-node-frontend-template'
      },
      {
        kind: 'link',
        url: '/cdp-portal-frontend/teams/cdp-platform',
        value: 'Cdp Platform'
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
