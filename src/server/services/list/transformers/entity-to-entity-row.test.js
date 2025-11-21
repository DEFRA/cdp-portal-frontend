import { entityToEntityRow } from './entity-to-entity-row.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

describe('#serviceToEntityRow', () => {
  test('Should provide expected entity row transformation', () => {
    expect(
      entityToEntityRow({ ...entityServicesFixture.at(0), isOwner: true })
    ).toEqual({
      creationState: {
        date: '2016-12-05T11:21:25Z'
      },
      entityName: 'cdp-portal-backend',
      githubUrl: 'https://github.com/DEFRA/cdp-portal-backend',
      isOwner: true,
      serviceTags: [
        {
          className: 'govuk-tag--green',
          description: 'Service is live and available to the public.',
          displayName: 'Live',
          name: 'live'
        },
        {
          className: 'govuk-tag--light-blue',
          description: 'Service is live but in public/private beta',
          displayName: 'Beta',
          name: 'beta'
        }
      ],
      serviceType: 'Backend',
      teams: [
        {
          url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
          value: 'Platform'
        }
      ]
    })
  })
})
