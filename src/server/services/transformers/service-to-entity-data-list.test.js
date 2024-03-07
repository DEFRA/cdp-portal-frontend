import { serviceToEntityDataList } from '~/src/server/services/transformers/service-to-entity-data-list'
import { serviceDetailFixture } from '~/src/__fixtures__/service-detail'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress'

describe('#serviceToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(serviceToEntityDataList(serviceDetailFixture)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/DEFRA/cdp-deployables`,
            value: 'DEFRA/cdp-deployables'
          },
          heading: 'GitHub Repository'
        },
        {
          entity: {
            kind: 'list',
            value: [
              {
                kind: 'link',
                url: '/teams/087d4a80-002b-48cf-a7d3-aa60b67784f0',
                value: 'Fish-and-octopus'
              }
            ]
          },
          heading: 'Team'
        },
        {
          entity: {
            kind: 'text',
            value: 'C#'
          },
          heading: 'Language'
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://hub.docker.com/r/defradigital/cdp-portal-deployables-backend/tags',
            value: 'defradigital/cdp-portal-deployables-backend/tags'
          },
          heading: 'Docker Hub'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-05T08:56:52Z'
          },
          heading: 'Repository Created'
        }
      ])
    })
  })

  describe('With an in progress service status', () => {
    test('Should provide expected service data list entities transformation', () => {
      const service = repositoryDecorator(
        createServiceStatusToService(
          createServiceStatusInProgressFixture.repositoryStatus
        ),
        repositoryFixture.repository
      )

      expect(serviceToEntityDataList(service)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/DEFRA/cdp-portal-frontend`,
            value: 'cdp-portal-frontend'
          },
          heading: 'GitHub Repository'
        },
        {
          entity: {
            kind: 'list',
            value: [
              {
                kind: 'link',
                url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                value: 'Platform'
              }
            ]
          },
          heading: 'Team'
        },
        {
          entity: {
            kind: 'text',
            value: 'JavaScript'
          },
          heading: 'Language'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-12T17:16:48+00:00'
          },
          heading: 'Repository Created'
        }
      ])
    })
  })
})
