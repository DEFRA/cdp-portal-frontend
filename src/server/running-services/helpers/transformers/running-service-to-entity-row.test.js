import { config } from '~/src/config/config.js'
import { environments } from '~/src/config/environments.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where.js'
import { transformRunningServices } from '~/src/server/running-services/helpers/transformers/running-services.js'
import { runningServiceToEntityRow } from '~/src/server/running-services/helpers/transformers/running-service-to-entity-row.js'

describe('#runningServiceToEntityRow', () => {
  const oidcAdminGroupId = config.get('oidcAdminGroupId')
  const allEnvironments = Object.values(environments).map(
    (env) => env.kebabName
  )
  const isAuthenticated = true

  const runningServices = whatsRunningWhereFixture
  const deployableServices = servicesFixture
  const userScopeUUIDs = [oidcAdminGroupId]

  const services = transformRunningServices({
    runningServices,
    deployableServices,
    userScopeUUIDs
  })
  const firstService = services.at(0)

  describe('When authenticated', () => {
    test('Should return the correct row structure', () => {
      const result = runningServiceToEntityRow(
        allEnvironments,
        isAuthenticated
      )(firstService)

      expect(result).toEqual({
        cells: [
          {
            entity: {
              kind: 'html',
              value: expect.stringContaining('app-star-icon')
            },
            headers: 'owner'
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
          {
            headers: 'management'
          },
          {
            headers: 'dev'
          },
          {
            headers: 'test'
          },
          {
            headers: 'ext-test'
          },
          {
            headers: 'perf-test'
          },
          {
            headers: 'prod'
          }
        ]
      })
    })
  })

  describe('When not authenticated', () => {
    test('Should return the correct row structure', () => {
      const result = runningServiceToEntityRow(
        allEnvironments,
        false
      )(firstService)

      expect(result).toEqual({
        cells: [
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
          {
            headers: 'management'
          },
          {
            headers: 'dev'
          },
          {
            headers: 'test'
          },
          {
            headers: 'ext-test'
          },
          {
            headers: 'perf-test'
          },
          {
            headers: 'prod'
          }
        ]
      })
    })
  })

  test('Should handle services without environments', () => {
    const serviceDataWithoutEnvironments = {
      ...firstService,
      environments: {}
    }
    const result = runningServiceToEntityRow(
      allEnvironments,
      isAuthenticated
    )(serviceDataWithoutEnvironments)
    expect(result).toEqual({
      cells: [
        {
          entity: {
            kind: 'html',
            value: expect.stringContaining('app-star-icon')
          },
          headers: 'owner'
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
          headers: 'infra-dev'
        },
        {
          headers: 'management'
        },
        {
          headers: 'dev'
        },
        {
          headers: 'test'
        },
        {
          headers: 'ext-test'
        },
        {
          headers: 'perf-test'
        },
        {
          headers: 'prod'
        }
      ]
    })
  })
})
