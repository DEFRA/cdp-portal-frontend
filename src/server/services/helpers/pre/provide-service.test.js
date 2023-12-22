import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch/fetch-deployable-service'
import { fetchUnfinishedService } from '~/src/server/services/helpers/fetch/fetch-unfinished-service'
import { fetchInProgressService } from '~/src/server/services/helpers/fetch/fetch-in-progress-service'
import { inProgressServiceStatusFixture } from '~/src/__fixtures__/in-progress-service-status'
import { unfinishedServiceStatusFixture } from '~/src/__fixtures__/unfinished-service-status'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'
import { repositoryFixture } from '~/src/__fixtures__/repository'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository')
jest.mock('~/src/server/services/helpers/fetch/fetch-deployable-service')
jest.mock('~/src/server/services/helpers/fetch/fetch-unfinished-service')
jest.mock('~/src/server/services/helpers/fetch/fetch-in-progress-service')

describe('#provideService', () => {
  const mockRequest = {
    params: { serviceId: 'cdp-portal-frontend' }
  }
  const notFound = {
    output: { statusCode: 404 },
    message: 'Not Found'
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With an in progress service', () => {
    beforeEach(() => {
      fetchInProgressService.mockResolvedValue(inProgressServiceStatusFixture)
      fetchUnfinishedService.mockRejectedValue(notFound)
    })

    test('Should provide expected in progress service', async () => {
      fetchRepository.mockRejectedValue(notFound)

      expect(await provideService.method(mockRequest)).toEqual({
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isInProgress: true,
        serviceName: 'cdp-portal-frontend',
        serviceStatus: inProgressServiceStatusFixture.inProgress,
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })

    test('Should provide expected in progress service type property', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideService.method(mockRequest)).toEqual(
        expect.objectContaining({ isInProgress: true })
      )
    })

    test('Should provide expected github decorated in progress service', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideService.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isInProgress: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: inProgressServiceStatusFixture.inProgress,
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

  describe('With an unfinished service', () => {
    beforeEach(() => {
      fetchInProgressService.mockRejectedValue(notFound)
      fetchUnfinishedService.mockResolvedValue(unfinishedServiceStatusFixture)
    })

    test('Should provide expected unfinished service', async () => {
      fetchRepository.mockRejectedValue(notFound)

      expect(await provideService.method(mockRequest)).toEqual({
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isUnfinished: true,
        serviceName: 'cdp-portal-frontend',
        serviceStatus: unfinishedServiceStatusFixture.unfinished,
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })

    test('Should provide expected unfinished service type property', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideService.method(mockRequest)).toEqual(
        expect.objectContaining({ isUnfinished: true })
      )
    })

    test('Should provide expected github decorated unfinished service', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)

      expect(await provideService.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isPrivate: true,
        isTemplate: false,
        isUnfinished: true,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: unfinishedServiceStatusFixture.unfinished,
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

  describe('With a deployable service', () => {
    beforeEach(() => {
      fetchInProgressService.mockRejectedValue(notFound)
      fetchUnfinishedService.mockRejectedValue(notFound)
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)
      fetchRepository.mockResolvedValue(repositoryFixture)
    })

    test('Should provide expected deployable service type property', async () => {
      expect(await provideService.method(mockRequest)).toEqual(
        expect.objectContaining({ isDeployable: true })
      )
    })

    test('Should provide expected github decorated deployable service', async () => {
      expect(await provideService.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA',
        id: 'cdp-portal-frontend',
        imageName: 'cdp-portal-frontend',
        isArchived: false,
        isDeployable: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
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
})
