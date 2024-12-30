import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts.js'

function utilityToEntityRow(utilityType) {
  return (utility) => [
    {
      kind: 'link',
      value: utility.id,
      url: `/utilities/${utilityType}/${utility.id}`
    },
    {
      kind: 'group',
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
      value: removeUrlParts(utility.url),
      url: utility.url,
      newWindow: true
    },
    {
      kind: 'date',
      value: utility.createdAt
    }
  ]
}

export { utilityToEntityRow }
