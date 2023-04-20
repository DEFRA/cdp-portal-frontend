import { config } from '~/src/config'

function transformServicesToEntities(service) {
  return [
    {
      kind: 'link',
      value: service.serviceName,
      url: `${config.get('appPathPrefix')}/services/${service.id}`,
      size: 'large'
    },
    {
      kind: 'link',
      value: service.repository,
      url: `https://github.com/DEFRA/${service.repository}`,
      newWindow: true,
      size: 'medium'
    },
    {
      kind: 'link',
      value: `@${service.owner}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/people/${service.owner}`,
      newWindow: true,
      size: 'medium'
    },
    {
      kind: 'date',
      value: service.timestamp,
      size: 'large'
    }
  ]
}

export { transformServicesToEntities }
