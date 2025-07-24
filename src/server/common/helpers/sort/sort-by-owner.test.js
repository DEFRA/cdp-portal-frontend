import { describe, expect, test } from 'vitest'
import { sortByOwner } from './sort-by-owner.js'
import { librariesFixture } from '../../../../__fixtures__/libraries.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

describe('#sortByOwner', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const servicesWithOwner = entityServicesFixture.map((entity) => ({
    ...entity,
    isOwner: entity.teams.some((team) => team.teamId === adminGroupId)
  }))
  const librariesWithOwner = librariesFixture.repositories.map((library) => ({
    ...library,
    isOwner: library.teams.some((team) => team.teamId === adminGroupId)
  }))

  describe('With owner information', () => {
    test('Should sort owned teams first', () => {
      expect(servicesWithOwner.sort(sortByOwner('name'))).toEqual([
        expect.objectContaining({
          name: 'cdp-example-node-postgres-be',
          isOwner: true
        }),
        expect.objectContaining({
          name: 'cdp-portal-backend',
          isOwner: true
        }),
        expect.objectContaining({
          name: 'cdp-portal-frontend',
          isOwner: true
        }),
        expect.objectContaining({
          name: 'cdp-portal-stubs',
          isOwner: true
        }),
        expect.objectContaining({
          name: 'cdp-user-service-backend',
          isOwner: true
        }),
        expect.objectContaining({
          name: 'ai-service',
          isOwner: false
        }),
        expect.objectContaining({
          name: 'forms-designer',
          isOwner: false
        }),
        expect.objectContaining({
          name: 'forms-service',
          isOwner: false
        })
      ])
    })
  })

  describe('Without owner information', () => {
    test('Should sort alphabetically by service name', () => {
      expect(entityServicesFixture.sort(sortByOwner('name'))).toEqual([
        expect.objectContaining({
          name: 'ai-service'
        }),
        expect.objectContaining({
          name: 'cdp-example-node-postgres-be'
        }),
        expect.objectContaining({
          name: 'cdp-portal-backend'
        }),
        expect.objectContaining({
          name: 'cdp-portal-frontend'
        }),
        expect.objectContaining({
          name: 'cdp-portal-stubs'
        }),
        expect.objectContaining({
          name: 'cdp-user-service-backend'
        }),
        expect.objectContaining({
          name: 'forms-designer'
        }),
        expect.objectContaining({
          name: 'forms-service'
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
