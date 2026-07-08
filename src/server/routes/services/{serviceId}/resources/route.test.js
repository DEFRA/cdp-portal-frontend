import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres
} from '#test-helpers/common-page-rendering.js'
import { entitySubTypes, statusCodes } from '@defra/cdp-validation-kit'
import { fetchResources } from '#server/services/helpers/fetch/fetch-resources.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/services/helpers/fetch/fetch-resources.js')

const serviceName = 'mock-service-with-resources'

describe('Service resources page', () => {
  let server

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all resources view', () => {
    beforeAll(async () => {
      mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
      fetchResources.mockResolvedValue({
        dev: {
          s3_buckets: [
            {
              icon: 'aws-s3',
              name: 'test-bucket',
              properties: {
                arn: 'arn:aws:s3:eu-west-2:333333333:test-bucket'
              }
            }
          ]
        },
        test: {
          s3_buckets: [
            {
              icon: 'aws-s3',
              name: 'test-bucket',
              properties: {
                arn: 'arn:aws:s3:eu-west-2:333333333:test-bucket'
              }
            }
          ]
        }
      })

      server = await initialiseServer()
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/resources`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant who doesnt own service', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/resources`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/resources`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/resources`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
