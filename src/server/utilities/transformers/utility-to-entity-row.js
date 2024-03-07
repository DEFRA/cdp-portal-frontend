function utilityToEntityRow(utilityType) {
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
      value: utility.id,
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
