import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres
} from '#test-helpers/common-page-rendering.js'
import { entitySubTypes, statusCodes } from '@defra/cdp-validation-kit'
import {
  listPathContents,
  folderTreeForPath
} from '#server/common/services/bucket-service/BucketService.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/services/helpers/fetch/fetch-resources.js')
vi.mock('#server/common/services/bucket-service/BucketService.js')

const serviceName = 'mock-service-with-resources'

describe('Service imports page', () => {
  let server

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('import view', () => {
    beforeAll(async () => {
      mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
      listPathContents.mockResolvedValue([
        {
          name: '18010 instrucciones.pdf',
          path: 'batch-0001/temp',
          size: 242332,
          modifiedDate: '2026-09-16T09:48:55Z',
          isFolder: true
        },
        {
          name: 'data-01.dat',
          path: 'batch-0001/data-01.dat',
          size: 42,
          modifiedDate: '2026-09-15T12:46:43Z',
          isFolder: false
        },
        {
          name: 'data-02.dat',
          path: 'batch-0001/data-01.dat',
          size: 42342,
          modifiedDate: '2026-09-15T12:48:23Z',
          isFolder: false
        }
      ])
      folderTreeForPath.mockResolvedValue({
        path: '',
        isCurrent: false,
        subNodes: {
          'batch-0001': { path: 'batch-0001/', isCurrent: true, subNodes: {} },
          'batch-0002': { path: 'batch-0002/', isCurrent: false, subNodes: {} }
        }
      })
      server = await initialiseServer()
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/imports`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page DOES NOT render for logged in tenant who doesnt own service', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/imports`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page DOES NOT renders for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/imports`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/imports`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
