import { config } from '~/src/config'

import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch-repository'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch-deployable-service'
import { fetchCreateServiceStatus } from '~/src/server/services/helpers/fetch-create-service-status'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'
import { repositoryFixture } from '~/src/__fixtures__/repository'

jest.mock('~/src/server/services/helpers/fetch-repository')
jest.mock('~/src/server/services/helpers/fetch-deployable-service')
jest.mock('~/src/server/services/helpers/fetch-create-service-status')

const githubOrg = config.get('githubOrg')

describe('#provideService', () => {
  const mockRequest = {
    params: { serviceId: 'cdp-portal-frontend' }
  }
  const notFound = {
    output: { statusCode: 404 },
    message: 'Not Found'
  }

  test('Should provide github decorated deployable service', async () => {
    fetchRepository.mockResolvedValue(repositoryFixture)
    fetchDeployableService.mockResolvedValue(serviceDeployableFixture)

    expect(await provideService.method(mockRequest)).toEqual({
      createdAt: '2023-04-12T17:16:48+00:00',
      description: 'The Core Delivery Platform Portal.',
      githubUrl: `https://github.com/${githubOrg}`,
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
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ]
    })
  })

  test('Should provide github decorated create service status service', async () => {
    fetchRepository.mockResolvedValue(repositoryFixture)
    fetchDeployableService.mockRejectedValue(notFound)
    fetchCreateServiceStatus.mockResolvedValue(createServiceStatusFixture)

    expect(await provideService.method(mockRequest)).toEqual({
      createdAt: '2023-04-12T17:16:48+00:00',
      description: 'The Core Delivery Platform Portal.',
      githubUrl: `https://github.com/${githubOrg}`,
      id: 'cdp-portal-frontend',
      isArchived: false,
      isCreateStatus: true,
      isPrivate: true,
      isTemplate: false,
      primaryLanguage: 'JavaScript',
      serviceName: 'cdp-portal-frontend',
      serviceStatus: createServiceStatusFixture.status,
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ]
    })
  })

  test('Should provide create service status service', async () => {
    fetchRepository.mockRejectedValue(notFound)
    fetchCreateServiceStatus.mockResolvedValue(createServiceStatusFixture)

    expect(await provideService.method(mockRequest)).toEqual({
      githubUrl: `https://github.com/${githubOrg}`,
      id: 'cdp-portal-frontend',
      isCreateStatus: true,
      serviceName: 'cdp-portal-frontend',
      serviceStatus: createServiceStatusFixture.status,
      teams: [
        {
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          name: 'Platform'
        }
      ]
    })
  })

  test('Should provide "404"', async () => {
    fetchRepository.mockRejectedValue(notFound)
    fetchCreateServiceStatus.mockRejectedValue(notFound)

    expect.assertions(1)

    try {
      await provideService.method(mockRequest)
    } catch (error) {
      expect(error).toHaveProperty('message', 'Not Found')
    }
  })
})
