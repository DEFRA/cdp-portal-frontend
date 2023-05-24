import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformServiceToHeadingEntities(service) {
  return {
    primary: [
      {
        kind: 'text',
        value: startCase(service.metadata.serviceType),
        label: 'Type'
      },
      ...(service?.teams
        ? [
            {
              kind: 'link',
              value: service.teams?.at(0)?.name,
              url: `${appConfig.get('appPathPrefix')}/teams/${
                service.teams?.at(0)?.slug
              }`,
              label: 'Team'
            }
          ]
        : [{ kind: 'text', value: null, label: 'Team' }])
    ],
    secondary: [
      {
        kind: 'date',
        value: service?.latestCommit?.committedDate,
        size: 'large',
        label: `Last merge to ${service?.latestCommit?.defaultBranchName}`
      },
      {
        kind: 'date',
        value: service.createdAt,
        size: 'large',
        label: 'Created'
      }
    ]
  }
}

export { transformServiceToHeadingEntities }
