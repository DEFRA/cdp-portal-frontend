function transformTeamToHeadingEntities(team) {
  return {
    primary: [
      {
        kind: 'link',
        value: `@${team.id}`,
        url: `https://github.com/orgs/defra-cdp-sandpit/teams/${team.id}`,
        newWindow: true,
        size: 'medium',
        label: 'GitHub'
      }
    ],
    secondary: [
      {
        kind: 'date',
        value: team.createdAt,
        size: 'large',
        label: 'Created'
      }
    ]
  }
}

export { transformTeamToHeadingEntities }
