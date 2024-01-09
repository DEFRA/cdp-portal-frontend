import { repositoryFixture } from '~/src/__fixtures__/repository'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchCreateServiceStatus } from '~/src/server/services/helpers/fetch/fetch-create-service-status'
import { provideServiceCreateStatus } from '~/src/server/services/helpers/pre/provide-service-create-status'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create-service-status-in-progress'
import { createServiceStatusSuccessFixture } from '~/src/__fixtures__/create-service-status-success'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository')
jest.mock('~/src/server/services/helpers/fetch/fetch-create-service-status')

describe('#provideServiceCreateStatus', () => {
  const mockIsXhr = jest.fn()
  const mockRequest = {
    params: { serviceId: 'cdp-portal-frontend' },
    isXhr: mockIsXhr
  }
  const notFound = {
    output: { statusCode: 404 },
    message: 'Not Found'
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With an in-progress create service status', () => {
    beforeEach(() => {
      fetchCreateServiceStatus.mockResolvedValue(
        createServiceStatusInProgressFixture
      )

      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected create service status', async () => {
      fetchRepository.mockRejectedValue(notFound)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual({
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isCreateService: true,
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture.repositoryStatus,
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })

    test('Should provide expected create service status type property', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual(
        expect.objectContaining({ isCreateService: true })
      )
    })

    test('Should provide expected github decorated create service status', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isCreateService: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture.repositoryStatus,
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })
  })

  describe('With a success create service status', () => {
    beforeEach(() => {
      fetchCreateServiceStatus.mockResolvedValue(
        createServiceStatusSuccessFixture
      )

      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected create service status', async () => {
      fetchRepository.mockRejectedValue(notFound)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual({
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isCreateService: true,
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusSuccessFixture.repositoryStatus,
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })

    test('Should provide expected create service status type property', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual(
        expect.objectContaining({ isCreateService: true })
      )
    })

    test('Should provide expected github decorated create service status', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideServiceCreateStatus.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isCreateService: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusSuccessFixture.repositoryStatus,
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })

    describe('When the request is an Xhr request', () => {
      beforeEach(() => {
        fetchCreateServiceStatus.mockResolvedValue(
          createServiceStatusSuccessFixture
        )
        fetchRepository.mockRejectedValue(notFound)

        mockIsXhr.mockReturnValue(true)
      })

      test('Should provide expected "null" response', async () => {
        expect(await provideServiceCreateStatus.method(mockRequest)).toBeNull()
      })
    })
  })
})
