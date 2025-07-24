import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { provideTestSuiteTabs } from './provide-test-suite-tabs.js'

const mockRouteLookup = vi.fn()
const mockUserIsOwner = vi.fn()
const mockUserSession = vi.fn()
const mockUserIsAdmin = vi.fn()
const mockUserIsTenant = vi.fn()

describe('#provideTestSuiteTabs', () => {
  const mockEntityName = 'cdp-env-test-suite'

  const mockRequest = ({ response, path = '' }) => ({
    response,
    path,
    getUserSession: mockUserSession,
    userIsOwner: mockUserIsOwner,
    userIsAdmin: mockUserIsAdmin,
    userIsTenant: mockUserIsTenant,
    routeLookup: mockRouteLookup,
    app: {
      entity: {
        name: mockEntityName
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
      mockRouteLookup.mockImplementation(
        (path, options) =>
          '/' + path.replace('{serviceId}', options.params.serviceId)
      )
      mockUserSession.mockResolvedValue({
        isAdmin: true,
        isTenant: true
      })
      mockUserIsAdmin.mockResolvedValue(true)
      mockUserIsTenant.mockResolvedValue(true)
    })

    test('Should provide expected context tabs', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/test-suites/${mockEntityName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(3)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}/secrets/dev`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/test-suites/${mockEntityName}/secrets`
        }
      ])
    })
  })

  describe('With a service owner', () => {
    beforeEach(() => {
      mockUserIsOwner.mockResolvedValue(true)

      mockUserSession.mockResolvedValue({
        isAdmin: false,
        isTenant: true
      })
      mockRouteLookup.mockImplementation(
        (path, options) =>
          '/' + path.replace('{serviceId}', options.params.serviceId)
      )
    })

    test('Should provide expected context tabs', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/test-suites/${mockEntityName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(3)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}/secrets/test`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/test-suites/${mockEntityName}/secrets`
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
      mockRouteLookup.mockImplementation(
        (path, options) =>
          '/' + path.replace('{serviceId}', options.params.serviceId)
      )
      mockUserIsAdmin.mockResolvedValue(false)
      mockUserIsTenant.mockResolvedValue(true)
    })

    test('Should provide expected context tabs', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(2)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}/buckets/test`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockEntityName}/proxy`
        }
      ])
    })
  })

  describe('With a logged out user', () => {
    beforeEach(() => {
      mockUserIsOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue(null)

      mockRouteLookup.mockReturnValueOnce(`/test-suites/${mockEntityName}`)
      mockUserIsAdmin.mockResolvedValue(false)
      mockUserIsTenant.mockResolvedValue(false)
    })

    test('Should provide expected context tabs', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(1)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockEntityName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockEntityName}`
        }
      ])
    })
  })
})
