import { config } from '~/src/config'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { serviceDetailFixture } from '~/src/__fixtures__/service-detail'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { decorateServiceWithGithubDetail } from '~/src/server/services/transformers/decorate-service-with-github-detail'
import { serviceGithubDetailFixture } from '~/src/__fixtures__/service-github-detail'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(transformServiceToEntityDataList(serviceDetailFixture)).toEqual([
        {
          entity: {
            kind: 'link',
            url: '/cdp-portal-frontend/teams/fisheries',
            value: 'fisheries'
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
            url: `https://github.com/${githubOrg}/cdp-deployables`,
            value: `${githubOrg}/cdp-deployables`
          },
          heading: 'Github Repository'
        },
        {
          entity: {
            kind: 'text',
            value: 'cdp-portal-deployables-backend'
          },
          heading: 'ECR Docker Image name'
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
      const service = transformServiceStatusToService(
        createServiceStatusFixture.status
      )
      const serviceWithGithubDetail = decorateServiceWithGithubDetail(
        service,
        serviceGithubDetailFixture.repository
      )

      expect(transformServiceToEntityDataList(serviceWithGithubDetail)).toEqual(
        [
          {
            entity: {
              kind: 'link',
              url: '/cdp-portal-frontend/teams/cdp-platform',
              value: 'cdp-platform'
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
              kind: 'link',
              newWindow: true,
              url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
              value: `${githubOrg}/cdp-portal-frontend`
            },
            heading: 'Github Repository'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-04-12T17:16:48+00:00'
            },
            heading: 'Repository created'
          }
        ]
      )
    })
  })
})
