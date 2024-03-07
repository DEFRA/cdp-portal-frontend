function teamToEntityDataList(team) {
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
      heading: 'Members',
      entity: {
        kind: 'text',
        value: team.users?.length
      }
    },
    {
      heading: 'Last updated',
      entity: {
        kind: 'date',
        value: team.updatedAt
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

export { teamToEntityDataList }
