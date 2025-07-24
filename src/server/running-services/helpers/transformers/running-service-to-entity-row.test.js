import { describe, expect, test } from 'vitest'
import { environments } from '../../../../config/environments.js'
import { runningServicesFixture } from '../../../../__fixtures__/running-services.js'
import { transformRunningServices } from './running-services.js'
import { runningServiceToEntityRow } from './running-service-to-entity-row.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

describe('#runningServiceToEntityRow', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const allEnvironments = Object.values(environments).map(
    (env) => env.kebabName
  )
  const runningServices = runningServicesFixture
  const deployableServices = entityServicesFixture
  const userScopeUUIDs = [adminGroupId]

  const services = transformRunningServices({
    runningServices,
    deployableServices,
    userScopeUUIDs
  })
  const firstService = services.at(0)

  describe('When authenticated', () => {
    test('Should return the correct row structure', () => {
      const result = runningServiceToEntityRow(allEnvironments)(firstService)

      expect(result).toEqual({
        cells: [
          {
            entity: {
              kind: 'html',
              value: expect.stringContaining('app-star-icon')
            },
            headers: 'owner',
            isCentered: true,
            classes: 'app-entity-table__cell--owned'
          },
          {
            entity: {
              kind: 'link',
              url: '/running-services/cdp-portal-frontend',
              value: 'cdp-portal-frontend'
            },
            headers: 'service'
          },
          {
            entity: {
              kind: 'group',
              value: [
                {
                  kind: 'link',
                  url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                  value: 'Platform'
                }
              ]
            },
            headers: 'team'
          },
          {
            entity: {
              kind: 'html',
              value: expect.stringContaining('Running in Infra-dev')
            },
            headers: 'infra-dev',
            isSlim: true
          },
          expect.objectContaining({
            headers: 'management'
          }),
          expect.objectContaining({
            headers: 'dev'
          }),
          expect.objectContaining({
            headers: 'test'
          }),
          expect.objectContaining({
            headers: 'ext-test'
          }),
          expect.objectContaining({
            headers: 'perf-test'
          }),
          expect.objectContaining({
            headers: 'prod'
          })
        ]
      })
    })
  })

  test('Should handle services without environments', () => {
    const serviceDataWithoutEnvironments = {
      ...firstService,
      environments: {}
    }
    const result = runningServiceToEntityRow(allEnvironments)(
      serviceDataWithoutEnvironments
    )
    expect(result).toEqual({
      cells: [
        {
          entity: {
            kind: 'html',
            value: expect.stringContaining('app-star-icon')
          },
          headers: 'owner',
          isCentered: true,
          classes: 'app-entity-table__cell--owned'
        },
        {
          entity: {
            kind: 'link',
            url: '/running-services/cdp-portal-frontend',
            value: 'cdp-portal-frontend'
          },
          headers: 'service'
        },
        {
          entity: {
            kind: 'group',
            value: [
              {
                kind: 'link',
                url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                value: 'Platform'
              }
            ]
          },
          headers: 'team'
        },
        expect.objectContaining({
          headers: 'infra-dev'
        }),
        expect.objectContaining({
          headers: 'management'
        }),
        expect.objectContaining({
          headers: 'dev'
        }),
        expect.objectContaining({
          headers: 'test'
        }),
        expect.objectContaining({
          headers: 'ext-test'
        }),
        expect.objectContaining({
          headers: 'perf-test'
        }),
        expect.objectContaining({
          headers: 'prod'
        })
      ]
    })
  })
})
