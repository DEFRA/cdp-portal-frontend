import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#allEnvironmentsOnlyForAdmin', () => {
  const mockRequest = ({ environment, isAdmin }) => ({
    getUserSession: jest.fn().mockResolvedValue({
      isAdmin
    }),
    params: {
      environment
    }
  })
  const adminRequest = (environment) =>
    mockRequest({ isAdmin: true, environment })
  const nonAdminRequest = (environment) =>
    mockRequest({ isAdmin: false, environment })

  const mockResponseToolkit = {
    continue: 'mockContinue'
  }

  describe('With Admin user', () => {
    test('Should allow access to "infra-dev" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('infra-dev'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "management" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('management'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "dev" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('dev'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "test" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('test'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "perf-test" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('perf-test'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "prod" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          adminRequest('prod'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })
  })

  describe('With a Non-Admin user', () => {
    test('Should not allow access to "infra-dev" environment', async () => {
      const error = await getError(async () =>
        allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('infra-dev'),
          mockResponseToolkit
        )
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error.output.statusCode).toEqual(401)
      expect(error).toHaveProperty('message', 'Unauthorized')
    })

    test('Should not allow access to "management" environment', async () => {
      const error = await getError(async () =>
        allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('management'),
          mockResponseToolkit
        )
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error.output.statusCode).toEqual(401)
      expect(error).toHaveProperty('message', 'Unauthorized')
    })

    test('Should allow access to "dev" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('dev'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "test" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('test'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "perf-test" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('perf-test'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })

    test('Should allow access to "prod" environment', async () => {
      expect(
        await allEnvironmentsOnlyForAdmin.method(
          nonAdminRequest('prod'),
          mockResponseToolkit
        )
      ).toEqual(mockResponseToolkit.continue)
    })
  })
})
