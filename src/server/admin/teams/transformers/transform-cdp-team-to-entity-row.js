function transformCdpTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: team.name,
      url: `/admin/teams/${team.teamId}`
    },
    {
      kind: 'text',
      value: team.description
    },
    {
      kind: 'link',
      value: team.github ? `@${team.github}` : null,
      url: `https://github.com/orgs/DEFRA/teams/${team.github}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: team.users.length
    }
  ]
}

export { transformCdpTeamToEntityRow }
