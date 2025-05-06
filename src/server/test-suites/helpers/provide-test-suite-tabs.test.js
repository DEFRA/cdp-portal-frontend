import { provideTestSuiteTabs } from '~/src/server/test-suites/helpers/provide-test-suite-tabs.js'

const mockRouteLookup = jest.fn()
const mockUserIsServiceOwner = jest.fn()
const mockUserSession = jest.fn()
const mockRequest = ({ response, path = '' }) => ({
  response,
  path,
  getUserSession: mockUserSession,
  userIsServiceOwner: mockUserIsServiceOwner,
  routeLookup: mockRouteLookup
})

describe('#provideTestSuiteTabs', () => {
  const mockEntityName = 'cdp-env-test-suite'
  const mockSource = {
    context: {
      entity: {
        name: `${mockEntityName}`
      }
    }
  }
  const mockResponse = {
    variety: 'view',
    source: mockSource
  }
  const mockViewHelper = {
    continue: 'mockContinue'
  }

  afterEach(() => {
    mockResponse.source = mockSource
  })

  describe('With an Admin user', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(false)
      mockRouteLookup.mockImplementation(
        (path, options) =>
          '/' + path.replace('{serviceId}', options.params.serviceId)
      )
      mockUserSession.mockResolvedValue({
        isAdmin: true,
        isTenant: true
      })
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
      mockUserIsServiceOwner.mockResolvedValue(true)

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
      mockUserIsServiceOwner.mockResolvedValue(false)

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
      mockUserIsServiceOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue(null)

      mockRouteLookup.mockReturnValueOnce(`/test-suites/${mockEntityName}`)
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
