import { provideSubNav } from './provide-sub-navigation.js'
import { scopes } from '@defra/cdp-validation-kit'
import { pluralise } from '../common/helpers/pluralise.js'

describe('#provideSubNavForentityType', () => {
  const mockToolkit = { continue: 'continue' }

  function mockRouteLookup(serviceKind, section, serviceId) {
    return vi.fn().mockImplementation((_url, { params }) => {
      return params?.environment
        ? `/${pluralise(serviceKind)}/${serviceId}/${section}/${params.environment}`
        : `/${pluralise(serviceKind)}/${serviceId}/${section}`
    })
  }

  const buildMockRequest = (
    serviceKind,
    section,
    { variety = 'view', source = {}, scope = [], app } = {}
  ) => ({
    response: {
      variety,
      source
    },
    path: `/${pluralise(serviceKind)}/${app?.entity?.name}/${section}/infra-dev`,
    routeLookup: mockRouteLookup(serviceKind, section, app?.entity?.name),
    auth: {
      credentials: {
        scope
      }
    },
    app
  })

  describe('When response variety is view', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('service', 'buckets', {
        source: {
          context: {}
        },
        scope: [scopes.admin, scopes.externalTest],
        app: {
          entity: {
            name: 'cdp-portal-frontend',
            type: 'Microservice',
            teams: [{ teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474' }]
          }
        }
      })
    })

    test('Should add sub navigation to response context for correct subtitle and serviceKind', async () => {
      const provideSubNavigation = provideSubNav('buckets', 'service')
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/cdp-portal-frontend/buckets'
        },
        {
          isActive: true,
          label: {
            text: 'Infra-dev'
          },
          url: '/services/cdp-portal-frontend/buckets/infra-dev'
        },
        {
          isActive: false,
          label: {
            text: 'Management'
          },
          url: '/services/cdp-portal-frontend/buckets/management'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/cdp-portal-frontend/buckets/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/cdp-portal-frontend/buckets/test'
        },
        {
          isActive: false,
          label: {
            text: 'Ext-test'
          },
          url: '/services/cdp-portal-frontend/buckets/ext-test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/cdp-portal-frontend/buckets/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/cdp-portal-frontend/buckets/prod'
        }
      ])
    })
  })

  describe('When response variety is not a view', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('test-suite', 'some-sub-section', {
        variety: 'plain'
      })
    })

    test('Should not modify response context', async () => {
      const provideSubNavigation = provideSubNav(
        'some-sub-section',
        'test-suite'
      )
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(
        mockRequest.response.source?.context?.subNavigation
      ).toBeUndefined()
    })
  })

  describe('When response context is undefined', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('service', 'buckets', {
        app: {
          entity: {
            name: 'some-service',
            type: 'Microservice'
          }
        }
      })
    })

    test('Should initialize response context', async () => {
      const provideSubNavigation = provideSubNav('proxy', 'service')
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context).toBeDefined()
    })
  })

  describe('With tenant service', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('service', 'terminal', {
        source: {},
        app: {
          entity: {
            name: 'mock-tenant-service',
            type: 'Microservice',
            teams: [
              {
                teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89'
              },
              {
                teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274'
              }
            ]
          }
        }
      })
    })

    test('Should provide sub nav without platform environments', async () => {
      const provideSubNavigation = provideSubNav('terminal', 'service')
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/mock-tenant-service/terminal'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/mock-tenant-service/terminal/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/mock-tenant-service/terminal/test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/mock-tenant-service/terminal/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/mock-tenant-service/terminal/prod'
        }
      ])
    })
  })

  describe('With tenant service that has external-test', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('service', 'proxy', {
        source: {},
        scope: [scopes.externalTest],
        app: {
          entity: {
            name: 'mock-tenant-service',
            type: 'Microservice',
            teams: [
              {
                teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89'
              },
              {
                teamId: '6ed0400a-a8a0-482b-b45a-109634cd1274'
              }
            ]
          }
        }
      })
    })

    test('Should provide sub nav without platform environments but with ext-test', async () => {
      const provideSubNavigation = provideSubNav('proxy', 'service')
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/mock-tenant-service/proxy'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/mock-tenant-service/proxy/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/mock-tenant-service/proxy/test'
        },
        {
          isActive: false,
          label: {
            text: 'Ext-test'
          },
          url: '/services/mock-tenant-service/proxy/ext-test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/mock-tenant-service/proxy/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/mock-tenant-service/proxy/prod'
        }
      ])
    })
  })

  describe('When teams array is empty', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest('test-suite', 'some-sub-section', {
        app: {
          entity: {
            name: 'mock-tenant-service',
            type: 'TestSuite',
            teams: []
          }
        }
      })
    })

    test('Should fallback as expected', async () => {
      const provideSubNavigation = provideSubNav(
        'some-sub-section',
        'test-suite'
      )
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/test-suites/mock-tenant-service/some-sub-section'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/test-suites/mock-tenant-service/some-sub-section/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/test-suites/mock-tenant-service/some-sub-section/test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/test-suites/mock-tenant-service/some-sub-section/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/test-suites/mock-tenant-service/some-sub-section/prod'
        }
      ])
    })
  })
})
