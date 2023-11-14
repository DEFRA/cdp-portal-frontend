function transformTeamToHeadingEntities(team) {
  return [
    {
      kind: 'date',
      value: team.updatedAt,
      label: 'Last updated'
    }
  ]
}

export { transformTeamToHeadingEntities }
