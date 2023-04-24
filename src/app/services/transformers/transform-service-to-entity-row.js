import { config } from '~/src/config'

function transformServiceToEntityRow(service) {
  return [
    {
      kind: 'link',
      value: service.serviceName,
      url: `${config.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'text',
      value: service.kind
    },
    {
      kind: 'link',
      value: service.repository,
      url: `https://github.com/DEFRA/${service.repository}`,
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
