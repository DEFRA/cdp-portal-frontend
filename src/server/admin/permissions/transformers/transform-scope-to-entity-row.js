import { config } from '~/src/config/index.js'

function transformScopeToEntityRow(scope) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'text',
      value: scope.name
    },
    {
      kind: 'text',
      value: scope.description
    },
    {
      kind: 'link',
      value: scope.github ? `@${scope.github}` : null,
      url: `https://github.com/orgs/${githubOrg}/scopes/${scope.github}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: scope.serviceCodes
    },
    {
      kind: 'html',
      value: scope.alertEmailAddresses?.join('<br>')
    },
    {
      kind: 'text',
      value: scope.users.length
    }
  ]
}

export { transformScopeToEntityRow }
