import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { noValue } from '~/src/common/constants/no-value'
import { buildServiceUrlText } from '~/src/app/services/helpers/build-service-url-text'

function transformServiceToEntityRow(service) {
  const serviceUrlText = buildServiceUrlText(service)

  return [
    {
      kind: 'link',
      value: startCase(service.id),
      url: `${appConfig.get('appPathPrefix')}/services/${service.id}`
    },
    {
      kind: 'text',
      value: service.metadata.serviceType
    },
    ...(service.owner.name
      ? [
          {
            kind: 'link',
            value: service.owner.name,
            url: `${appConfig.get('appPathPrefix')}/teams/${service.owner.slug}`
          }
        ]
      : [{ kind: 'text', value: noValue }]),
    {
      kind: 'link',
      value: serviceUrlText,
      url: service.url,
      newWindow: true
    },
    {
      kind: 'link',
      value: service.repositoryUrl.replace(/https:\/\/github\.com\//g, ''),
      url: service.repositoryUrl,
      newWindow: true
    },
    {
      kind: 'date',
      value: service.createdAt,
      size: 'large'
    }
  ]
}

export { transformServiceToEntityRow }
