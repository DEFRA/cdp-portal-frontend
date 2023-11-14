import { removeHost } from '~/src/server/common/helpers/remove-host'

function transformUtilityToEntityRow(utilityType) {
  return (utility) => [
    {
      kind: 'link',
      value: utility.id,
      url: `/utilities/${utilityType}/${utility.id}`
    },
    {
      kind: 'list',
      value: utility?.teams?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))
    },
    {
      kind: 'text',
      value: utility.primaryLanguage
    },
    {
      kind: 'link',
      value: removeHost(utility.url),
      url: utility.url,
      newWindow: true
    },
    {
      kind: 'date',
      value: utility.createdAt
    }
  ]
}

export { transformUtilityToEntityRow }
