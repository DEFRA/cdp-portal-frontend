function transformCdpTeamToHeadingEntities(team) {
  return [
    {
      kind: 'date',
      value: team.updatedAt,
      label: 'Last updated'
    }
  ]
}

export { transformCdpTeamToHeadingEntities }
