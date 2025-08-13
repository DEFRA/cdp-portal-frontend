import { hasScopeDecorator } from '../../common/helpers/decorators/has-scope.js'
import { provideServiceTabs } from './provide-service-tabs.js'

const mockServiceName = 'cdp-portal-frontend'
const mockUserIsOwner = vi.fn()
const mockUserSession = vi.fn()
const mockRouteLookup = vi.fn(
  (id) => `/${id.replace('{serviceId}', mockServiceName)}`
)

describe('#provideServiceTabs', () => {
  const mockRequest = ({ response, path = '', scope = [] }) => ({
    response,
    path,
    getUserSession: mockUserSession,
    userIsOwner: mockUserIsOwner,
    routeLookup: mockRouteLookup,
    hasScope: hasScopeDecorator({
      auth: { credentials: { scope } }
    }),
    app: {
      entity: {
        name: mockServiceName
      }
    }
  })
  const mockResponse = {
    variety: 'view',
    source: {}
  }
  const mockViewHelper = {
    continue: 'mockContinue'
  }

  afterEach(() => {
    mockResponse.source = {}
  })

  describe('With an Admin user', () => {
    beforeEach(() => {
      mockUserIsOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue({
        isAdmin: true,
        isTenant: true
      })
    })

    test('Should provide expected context tabs', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Automations',
          url: `/services/${mockServiceName}/automations`
        },
        {
          isActive: false,
          label: 'Maintenance',
          url: `/services/${mockServiceName}/maintenance`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        },
        {
          isActive: false,
          label: 'Terminal',
          url: `/services/${mockServiceName}/terminal`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(7)
    })

    test('Should mark matching url as Active', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/secrets/dev`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Automations',
          url: `/services/${mockServiceName}/automations`
        },
        {
          isActive: false,
          label: 'Maintenance',
          url: `/services/${mockServiceName}/maintenance`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        },
        {
          isActive: false,
          label: 'Terminal',
          url: `/services/${mockServiceName}/terminal`
        }
      ])
    })
  })

  describe('With a service owner', () => {
    beforeEach(async () => {
      mockUserIsOwner.mockResolvedValue(true)

      mockUserSession.mockResolvedValue({
        isAdmin: false,
        isTenant: true
      })

      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`
        }),
        mockViewHelper
      )
    })

    test('Should provide expected context tabs', () => {
      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Automations',
          url: `/services/${mockServiceName}/automations`
        },
        {
          isActive: false,
          label: 'Maintenance',
          url: `/services/${mockServiceName}/maintenance`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        },
        {
          isActive: false,
          label: 'Terminal',
          url: `/services/${mockServiceName}/terminal`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(7)
    })

    test('Should not show admin only tabs', () => {
      expect(mockResponse.source.context.tabDetails.tabs).toEqual(
        expect.not.arrayContaining([
          {
            isActive: false,
            label: 'Automation',
            url: `/services/${mockServiceName}/automations`
          }
        ])
      )
    })

    test('Should mark matching url as Active', () => {
      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Automations',
          url: `/services/${mockServiceName}/automations`
        },
        {
          isActive: false,
          label: 'Maintenance',
          url: `/services/${mockServiceName}/maintenance`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        },
        {
          isActive: false,
          label: 'Terminal',
          url: `/services/${mockServiceName}/terminal`
        }
      ])
    })
  })

  describe('With a tenant', () => {
    beforeEach(() => {
      mockUserIsOwner.mockResolvedValue(false)

      mockUserSession.mockResolvedValue({
        isAdmin: false,
        isTenant: true
      })
    })

    test('Should provide expected context tabs', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(3)
    })

    test('Should mark matching url as Active', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/resources/test`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/services/${mockServiceName}/proxy`
        },
        {
          isActive: true,
          label: 'Resources',
          url: `/services/${mockServiceName}/resources`
        }
      ])
    })
  })

  describe('With a logged out user', () => {
    beforeEach(() => {
      mockUserIsOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue(null)
    })

    test('Should provide expected context tabs', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(1)
    })

    test('Should mark matching url as Active', async () => {
      await provideServiceTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        }
      ])
    })
  })
})
