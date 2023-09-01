function transformCdpTeamToEntityDataList(team) {
  return [
    {
      heading: 'Name',
      entity: {
        kind: 'text',
        value: team.name
      }
    },
    {
      heading: 'Description',
      entity: {
        kind: 'paragraph',
        value: team.description
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
