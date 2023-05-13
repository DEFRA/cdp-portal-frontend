import { appConfig } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: service.serviceName,
      url: `${appConfig.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'text',
      value: service.kind
    },
    {
      kind: 'link',
      value: service.gitHubUrl,
      url: `https://github.com/DEFRA/${service.gitHubUrl}`,
      newWindow: true
    },
    {
      kind: 'link',
      value: `@${service.owner}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/people/${service.owner}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: service.timestamp
    }
  ]
}

export { transformServiceToEntityRow }
