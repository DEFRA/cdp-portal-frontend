import { provideSubNavigation } from '~/src/server/services/secrets/helpers/provide-sub-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

describe('#provideSubNavigation', () => {
  const mockToolkit = { continue: 'continue' }
  const mockRouteLookup = jest.fn().mockImplementation((_url, { params }) => {
    return params?.environment
      ? `/services/cdp-portal-frontend/secrets/${params.environment}`
      : '/services/cdp-portal-frontend/secrets'
  })

  const buildMockRequest = ({
    variety = 'view',
    source = {},
    scope = []
  } = {}) => ({
    response: {
      variety,
      source
    },
    path: '/services/cdp-portal-frontend/secrets/infra-dev',
    routeLookup: mockRouteLookup,
    auth: {
      credentials: {
        scope
      }
    }
  })

  describe('When response variety is view', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest({
        source: {
          context: {
            service: {
              imageName: 'cdp-portal-frontend',
              teams: [{ teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474' }]
            }
          }
        },
        scope: [scopes.admin, scopes.externalTest]
      })
    })

    test('Should add sub navigation to response context', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/cdp-portal-frontend/secrets'
        },
        {
          isActive: true,
          label: {
            text: 'Infra-dev'
          },
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: {
            text: 'Management'
          },
          url: '/services/cdp-portal-frontend/secrets/management'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/cdp-portal-frontend/secrets/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/cdp-portal-frontend/secrets/test'
        },
        {
          isActive: false,
          label: {
            text: 'Ext-test'
          },
          url: '/services/cdp-portal-frontend/secrets/ext-test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/cdp-portal-frontend/secrets/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/cdp-portal-frontend/secrets/prod'
        }
      ])
    })
  })

  describe('When response variety is not a view', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest({ variety: 'plain' })
    })

    test('Should not modify response context', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(
        mockRequest.response.source?.context?.subNavigation
      ).toBeUndefined()
    })
  })

  describe('When response context is undefined', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest()
    })

    test('Should initialize response context', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context).toBeDefined()
    })
  })

  describe('With tenant service', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest({
        source: {
          context: {
            service: {
              imageName: 'mock-tenant-service',
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
        }
      })
    })

    test('Should provide sub nav without platform environments', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/cdp-portal-frontend/secrets'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/cdp-portal-frontend/secrets/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/cdp-portal-frontend/secrets/test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/cdp-portal-frontend/secrets/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/cdp-portal-frontend/secrets/prod'
        }
      ])
    })
  })

  describe('With tenant service that has external-test', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest({
        source: {
          context: {
            service: {
              imageName: 'mock-tenant-service',
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
        },
        scope: [scopes.externalTest]
      })
    })

    test('Should provide sub nav without platform environments but with ext-test', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/cdp-portal-frontend/secrets'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/cdp-portal-frontend/secrets/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/cdp-portal-frontend/secrets/test'
        },
        {
          isActive: false,
          label: {
            text: 'Ext-test'
          },
          url: '/services/cdp-portal-frontend/secrets/ext-test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/cdp-portal-frontend/secrets/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/cdp-portal-frontend/secrets/prod'
        }
      ])
    })
  })

  describe('When teams array is empty', () => {
    let mockRequest

    beforeEach(() => {
      mockRequest = buildMockRequest({
        source: {
          context: {
            service: {
              imageName: 'mock-tenant-service',
              teams: []
            }
          }
        }
      })
    })

    test('Should fallback as expected', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: false,
          label: {
            text: 'All'
          },
          url: '/services/cdp-portal-frontend/secrets'
        },
        {
          isActive: false,
          label: {
            text: 'Dev'
          },
          url: '/services/cdp-portal-frontend/secrets/dev'
        },
        {
          isActive: false,
          label: {
            text: 'Test'
          },
          url: '/services/cdp-portal-frontend/secrets/test'
        },
        {
          isActive: false,
          label: {
            text: 'Perf-test'
          },
          url: '/services/cdp-portal-frontend/secrets/perf-test'
        },
        {
          isActive: false,
          label: {
            text: 'Prod'
          },
          url: '/services/cdp-portal-frontend/secrets/prod'
        }
      ])
    })
  })
})
