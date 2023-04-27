import { appConfig } from '~/src/config'

function transformRepositoryToEntityRow(repository) {
  return [
    {
      kind: 'link',
      value: repository.serviceName,
      url: `${appConfig.get('appPathPrefix')}/repositories/${repository.id}`
    },
    {
      kind: 'text',
      value: repository.kind
    },
    {
      kind: 'link',
      value: repository.gitHubUrl,
      url: `https://github.com/DEFRA/${repository.gitHubUrl}`,
      newWindow: true
    },
    {
      kind: 'link',
      value: `@${repository.owner}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/people/${repository.owner}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: repository.timestamp
    }
  ]
}

export { transformRepositoryToEntityRow }
