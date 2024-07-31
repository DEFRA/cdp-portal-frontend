import { provideSubNavigation } from '~/src/server/services/helpers/provide-sub-navigation'

describe('#provideSubNavigation', () => {
  const mockToolkit = { continue: 'continue' }
  const mockRouteLookup = jest
    .fn()
    .mockReturnValue('/services/cdp-portal-frontend/secrets/infra-dev')

  const buildMockRequest = ({ variety = 'view', source = {} } = {}) => ({
    response: {
      variety,
      source
    },
    path: '/services/cdp-portal-frontend/secrets/infra-dev',
    routeLookup: mockRouteLookup
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
        }
      })
    })

    test('Should add sub navigation to response context', async () => {
      await provideSubNavigation(mockRequest, mockToolkit)

      expect(mockRequest.response.source.context.subNavigation).toEqual([
        {
          isActive: true,
          label: 'Infra-dev',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Management',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Dev',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
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
          label: 'Dev',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
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
          label: 'Dev',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Perf-test',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        },
        {
          isActive: false,
          label: 'Prod',
          url: '/services/cdp-portal-frontend/secrets/infra-dev'
        }
      ])
    })
  })
})
