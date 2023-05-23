import { appConfig } from '~/src/config'

function transformServiceToHeadingEntities(service) {
  return {
    primary: [
      {
        kind: 'text',
        value: service.metadata.serviceType,
        label: 'Type'
      },
      ...(service.owner.name
        ? [
            {
              kind: 'link',
              value: service.owner.name,
              url: `${appConfig.get('appPathPrefix')}/teams/${
                service.owner.slug
              }`,
              label: 'Owner'
            }
          ]
        : [{ kind: 'text', value: 'No owner', label: 'Owner' }])
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
