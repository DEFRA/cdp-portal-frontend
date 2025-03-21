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
  const mockServiceName = 'cdp-env-test-suite'
  const mockSource = {
    context: {
      service: {
        imageName: `${mockServiceName}`
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
          path: `/test-suites/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/test-suites/${mockServiceName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(3)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockServiceName}/secrets/dev`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/test-suites/${mockServiceName}/secrets`
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
          path: `/test-suites/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/test-suites/${mockServiceName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(3)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockServiceName}/secrets/test`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/test-suites/${mockServiceName}/secrets`
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
          path: `/test-suites/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(2)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockServiceName}/buckets/test`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Proxy',
          url: `/test-suites/${mockServiceName}/proxy`
        }
      ])
    })
  })

  describe('With a logged out user', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue(null)

      mockRouteLookup.mockReturnValueOnce(`/test-suites/${mockServiceName}`)
    })

    test('Should provide expected context tabs', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(1)
    })

    test('Should mark matching url as Active', async () => {
      await provideTestSuiteTabs(
        mockRequest({
          response: mockResponse,
          path: `/test-suites/${mockServiceName}`
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabDetails.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/test-suites/${mockServiceName}`
        }
      ])
    })
  })
})
