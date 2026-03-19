export default {
  options: {
    id: 'dependency-explorer'
  },
  handler: async (request, h) => {
    const rows = [
      {
        entity: 'cdp-portal-frontend',
        entityVersion: '1.1.1',
        entityVersionTag: 'latest',
        teams: ['one', 'two'],
        dependencyVersion: '0.4.5'
      },
      {
        entity: 'cdp-portal-backend',
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        teams: ['one', 'two'],
        dependencyVersion: '0.4.5'
      }
    ]

    return h.view('dependency-explorer/views/entities-list', {
      pageTitle: 'Dependencies Explorer',

      tableData: {
        headers: [
          {
            id: 'entity',
            text: 'Consuming Service',
            width: '15',
            isLeftAligned: true
          },
          { id: 'entityVersion', text: 'Service version', width: '10' },
          { id: 'teams', text: 'Team', width: '15' },
          { id: 'dependencyVersion', text: 'Dependency version', width: '10' },
          { id: 'environments', text: 'Environments', width: '25' }
        ],
        rows,
        noResult: 'No dependencies found',
        isWide: false,
        isInverse: true
      }
    })
  }
}
