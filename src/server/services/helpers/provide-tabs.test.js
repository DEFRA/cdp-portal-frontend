import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'

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

describe('#provideTabs', () => {
  const mockServiceName = 'cdp-portal-frontend'
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
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/buckets`
      )
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/terminal`
      )
      mockUserSession.mockResolvedValue({
        isAdmin: true
      })
    })

    test('Should provide expected context tabs', async () => {
      await provideTabs(
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
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
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
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(4)
    })

    test('Should mark matching url as Active', async () => {
      await provideTabs(
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
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
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
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(true)

      mockUserSession.mockResolvedValue({
        isAdmin: false
      })
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/buckets`
      )
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/terminal`
      )
    })

    test('Should provide expected context tabs', async () => {
      await provideTabs(
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
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
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
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(4)
    })

    test('Should mark matching url as Active', async () => {
      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/secrets/test`
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
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
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

  describe('With a tenant', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(false)

      mockUserSession.mockResolvedValue({
        isAdmin: false
      })
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/buckets`
      )
    })

    test('Should provide expected context tabs', async () => {
      await provideTabs(
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
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
        }
      ])
      expect(mockResponse.source.context.tabDetails.tabs).toHaveLength(2)
    })

    test('Should mark matching url as Active', async () => {
      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/buckets/test`
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
          isActive: true,
          label: 'Buckets',
          url: `/services/${mockServiceName}/buckets`
        }
      ])
    })
  })

  describe('With a logged out user', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(false)
      mockUserSession.mockResolvedValue(null)

      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
    })

    test('Should provide expected context tabs', async () => {
      await provideTabs(
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
      await provideTabs(
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
