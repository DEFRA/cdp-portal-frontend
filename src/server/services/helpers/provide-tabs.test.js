import { provideTabs } from '~/src/server/services/helpers/provide-tabs'

const mockRouteLookup = jest.fn()
const mockUserIsServiceOwner = jest.fn()
const mockRequest = ({ response, path = '', isAdmin }) => ({
  response,
  path,
  getUserSession: jest.fn().mockResolvedValue({
    isAdmin
  }),
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
    })

    test('Should provide expected context tabs', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`,
          isAdmin: true
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabs).toHaveLength(2)
    })

    test('Should mark matching url as Active', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/secrets/dev`,
          isAdmin: true
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        }
      ])
    })
  })

  describe('With a tenant user', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(true)
    })

    test('Should provide expected context tabs', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`,
          isAdmin: false
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: false,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        }
      ])
      expect(mockResponse.source.context.tabs).toHaveLength(2)
    })

    test('Should mark matching url as Active', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}/secrets/test`,
          isAdmin: false
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: false,
          label: 'About',
          url: `/services/${mockServiceName}`
        },
        {
          isActive: true,
          label: 'Secrets',
          url: `/services/${mockServiceName}/secrets`
        }
      ])
    })
  })

  describe('With a logged out user', () => {
    beforeEach(() => {
      mockUserIsServiceOwner.mockResolvedValue(false)
    })

    test('Should provide expected context tabs', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`,
          isAdmin: false
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        }
      ])
      expect(mockResponse.source.context.tabs).toHaveLength(1)
    })

    test('Should mark matching url as Active', async () => {
      mockRouteLookup.mockReturnValueOnce(`/services/${mockServiceName}`)
      mockRouteLookup.mockReturnValueOnce(
        `/services/${mockServiceName}/secrets`
      )

      await provideTabs(
        mockRequest({
          response: mockResponse,
          path: `/services/${mockServiceName}`,
          isAdmin: false
        }),
        mockViewHelper
      )

      expect(mockResponse.source.context.tabs).toEqual([
        {
          isActive: true,
          label: 'About',
          url: `/services/${mockServiceName}`
        }
      ])
    })
  })
})
