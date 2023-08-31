import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { transformUserToHeadingEntities } from '~/src/server/admin/users/transformers/transform-user-to-heading-entities'

describe('#transformUserToHeadingEntities', () => {
  test('Should provide expected user heading entities transformation', () => {
    expect(transformUserToHeadingEntities(cdpUserFixture.user)).toEqual([
      {
        kind: 'date',
        label: 'Last updated',
        value: '2023-08-24T15:31:52.259Z'
      }
    ])
  })
})
