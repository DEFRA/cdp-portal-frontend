import { config } from '~/src/config'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { serviceDetailFixture } from '~/src/__fixtures__/service-detail'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { decorateService } from '~/src/server/services/transformers/decorate-service'
import { serviceGithubDetailFixture } from '~/src/__fixtures__/service-github-detail'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(transformServiceToEntityDataList(serviceDetailFixture)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}/cdp-deployables`,
            value: `${githubOrg}/cdp-deployables`
          },
          heading: 'Github Repository'
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
          heading: 'Type'
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://hub.docker.com/r/defradigital/cdp-portal-deployables-backend',
            value: 'defradigital/cdp-portal-deployables-backend'
          },
          heading: 'Docker Hub'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-05T08:56:52Z'
          },
          heading: 'Repository created'
        }
      ])
    })
  })

  describe('With a create service status', () => {
    test('Should provide expected service data list entities transformation', () => {
      const service = decorateService(
        transformServiceStatusToService(createServiceStatusFixture.status),
        serviceGithubDetailFixture.repository
      )

      expect(transformServiceToEntityDataList(service)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}`,
            value: `${githubOrg}`
          },
          heading: 'Github Repository'
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
          heading: 'Type'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-12T17:16:48+00:00'
          },
          heading: 'Repository created'
        }
      ])
    })
  })
})
