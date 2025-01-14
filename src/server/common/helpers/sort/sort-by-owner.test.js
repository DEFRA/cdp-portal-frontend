import { config } from '~/src/config/config.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'

describe('#sortByOwner', () => {
  const oidcAdminGroupId = config.get('oidcAdminGroupId')
  const servicesWithOwner = servicesFixture.map((service) => ({
    ...service,
    userOwnsService: service.teams.some(
      (team) => team.teamId === oidcAdminGroupId
    )
  }))

  describe('With owner information', () => {
    test('Should sort owned teams first', () => {
      expect(servicesWithOwner.sort(sortByOwner)).toEqual([
        expect.objectContaining({
          serviceName: 'cdp-portal-frontend',
          userOwnsService: true
        }),
        expect.objectContaining({
          serviceName: 'cdp-user-service-backend',
          userOwnsService: true
        }),
        expect.objectContaining({
          serviceName: 'forms-designer',
          userOwnsService: false
        })
      ])
    })
  })

  describe('Without owner information', () => {
    test('Should sort alphabetically by service name', () => {
      expect(servicesFixture.sort(sortByOwner)).toEqual([
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
})
