import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { librariesFixture } from '~/src/__fixtures__/libraries.js'

describe('#sortByOwner', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const servicesWithOwner = servicesFixture.map((service) => ({
    ...service,
    isOwner: service.teams.some((team) => team.teamId === adminGroupId)
  }))
  const librariesWithOwner = librariesFixture.repositories.map((library) => ({
    ...library,
    isOwner: library.teams.some((team) => team.teamId === adminGroupId)
  }))

  describe('With owner information', () => {
    test('Should sort owned teams first', () => {
      expect(servicesWithOwner.sort(sortByOwner('serviceName'))).toEqual([
        expect.objectContaining({
          serviceName: 'cdp-example-node-postgres-be',
          isOwner: true
        }),
        expect.objectContaining({
          serviceName: 'cdp-portal-frontend',
          isOwner: true
        }),
        expect.objectContaining({
          serviceName: 'cdp-user-service-backend',
          isOwner: true
        }),
        expect.objectContaining({
          serviceName: 'ai-backend',
          isOwner: false
        }),
        expect.objectContaining({
          serviceName: 'forms-designer',
          isOwner: false
        })
      ])
    })
  })

  describe('Without owner information', () => {
    test('Should sort alphabetically by service name', () => {
      expect(servicesFixture.sort(sortByOwner('serviceName'))).toEqual([
        expect.objectContaining({
          serviceName: 'ai-backend'
        }),
        expect.objectContaining({
          serviceName: 'cdp-example-node-postgres-be'
        }),
        expect.objectContaining({
          serviceName: 'cdp-portal-frontend'
        }),
        expect.objectContaining({
          serviceName: 'cdp-user-service-backend'
        }),
        expect.objectContaining({
          serviceName: 'forms-designer'
        })
      ])
    })
  })

  describe('With alternative prop', () => {
    test('Should sort owned teams first', () => {
      expect(librariesWithOwner.sort(sortByOwner('id'))).toEqual([
        expect.objectContaining({
          id: 'hapi-tracing',
          isOwner: true
        }),
        expect.objectContaining({
          id: 'useful-util',
          isOwner: false
        })
      ])
    })
  })
})
