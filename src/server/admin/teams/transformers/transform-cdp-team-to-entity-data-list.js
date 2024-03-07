function transformCdpTeamToEntityDataList(team) {
  return [
    {
      heading: 'GitHub team',
      entity: {
        kind: 'link',
        value: team.github ? `@${team.github}` : null,
        url: `https://github.com/orgs/DEFRA/teams/${team.github}`,
        newWindow: true
      }
    },
    {
      heading: 'Created',
      entity: {
        kind: 'date',
        value: team.createdAt
      }
    }
  ]
}

export { transformCdpTeamToEntityDataList }
