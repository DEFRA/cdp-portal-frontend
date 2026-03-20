export default {
  options: {
    id: 'dependency-list'
  },
  handler: async (request, h) => {
    const entity = request.params.entity

    const rows = [
      {
        dependency: 'pino',
        dependencyVersion: '2.4.5'
      },
      {
        dependency: 'chalk',
        dependencyVersion: '12.0.5'
      },
      {
        dependency: '@hapi/hapi',
        dependencyVersion: '18.4.5'
      },
      {
        dependency: '@hapi/jwt',
        dependencyVersion: '3.4.5'
      }
    ]

    return h.view('dependency-explorer/views/dependencies-list', {
      pageTitle: `Dependencies Explorer - ${entity}`,
      entity,
      tableData: {
        headers: [
          {
            id: 'dependency',
            text: 'Dependency',
            width: '20',
            isLeftAligned: true
          },
          { id: 'dependencyVersion', text: 'Version', width: '10' }
        ],
        rows,
        noResult: 'No dependencies found',
        isWide: false,
        isInverse: true
      },
      breadcrumbs: [
        {
          text: 'Dependency Explorer',
          href: '/dependency-explorer'
        },
        {
          text: entity
        }
      ]
    })
  }
}
