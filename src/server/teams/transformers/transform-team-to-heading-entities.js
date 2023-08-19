function transformTeamToHeadingEntities(team) {
  return [
    {
      kind: 'link',
      value: `@${team.id}`,
      url: `https://github.com/orgs/defra-cdp-sandpit/teams/${team.id}`,
      newWindow: true,
      size: 'medium',
      label: 'GitHub'
    },
    {
      kind: 'date',
      value: team.createdAt,
      size: 'large',
      label: 'Created'
    }
  ]
}

export { transformTeamToHeadingEntities }
