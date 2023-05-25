import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToEntityDataList(service) {
  const team = service?.teams?.at(0)

  return [
    {
      heading: 'Team',
      entity: {
        kind: 'link',
        value: team?.name,
        url: `${appConfig.get('appPathPrefix')}/teams/${team?.slug}`
      }
    },
    {
      heading: 'Type',
      entity: { kind: 'text', value: startCase(service.metadata.serviceType) }
    },
    {
      heading: 'GitHub Repository',
      html: `<a className="app-link" href="${service.repositoryUrl}" target="_blank">defra-cdp-sandpit/${service.id}</a>`
    },
    {
      heading: 'ECR Docker Image name',
      text: service.metadata.imageName ?? service.id
    },
    {
      heading: `Last merge to ${service.latestCommit.defaultBranchName}`,
      entity: { kind: 'date', value: service.latestCommit.committedDate }
    },
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { transformServiceToEntityDataList }
