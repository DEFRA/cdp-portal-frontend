import { appConfig } from '~/src/config'

function transformCodeRepositoryToEntityRow(codeRepository) {
  return [
    {
      kind: 'link',
      value: codeRepository.serviceName,
      url: `${appConfig.get('appPathPrefix')}/code-repositories/${
        codeRepository.id
      }`
    },
    {
      kind: 'text',
      value: codeRepository.kind
    },
    {
      kind: 'link',
      value: codeRepository.gitHubUrl,
      url: `https://github.com/DEFRA/${codeRepository.gitHubUrl}`,
      newWindow: true
    },
    {
      kind: 'link',
      value: `@${codeRepository.owner}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/people/${codeRepository.owner}`,
      newWindow: true
    },
    {
      kind: 'date',
      value: codeRepository.timestamp
    }
  ]
}

export { transformCodeRepositoryToEntityRow }
