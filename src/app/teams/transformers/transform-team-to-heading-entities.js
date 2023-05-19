function transformTeamToHeadingEntities(team) {
  return {
    primary: [
      {
        kind: 'link',
        value: `@${team.id}`,
        url: `https://github.com/orgs/defra-cdp-sandpit/teams/${team.id}`,
        newWindow: true,
        size: 'medium',
        label: 'Team'
      },
      {
        kind: 'text',
        value: team.members?.length,
        size: 'small',
        label: 'Members'
      },
      {
        kind: 'text',
        value: team?.repositories?.length,
        size: 'small',
        label: 'Repositories'
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
