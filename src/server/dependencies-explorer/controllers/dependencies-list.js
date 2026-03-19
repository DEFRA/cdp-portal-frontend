export default {
  options: {
    id: 'dependencies-explorer'
  },
  handler: async (request, h) => {
    return h.view('dependencies-explorer/views/dependencies-list', {
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
          { id: 'teams', text: 'Teams', width: '15' },
          { id: 'dependencyVersion', text: 'Dependency version', width: '10' },
          { id: 'environments', text: 'Environments', width: '25' }
        ],
        rows: [],
        noResult: 'No dependencies found',
        isWide: false,
        isInverse: true
      }
    })
  }
}
