function teamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    },
    {
      kind: 'link',
      value: team?.github ? `@${team.github}` : null,
      url: team?.github
        ? `https://github.com/orgs/DEFRA/teams/${team.github}`
        : null,
      newWindow: true
    },
    {
      kind: 'text',
      value: team.users?.length
    },
    {
      kind: 'date',
      value: team.updatedAt
    },
    {
      kind: 'date',
      value: team.createdAt
    }
  ]
}

export { teamToEntityRow }
