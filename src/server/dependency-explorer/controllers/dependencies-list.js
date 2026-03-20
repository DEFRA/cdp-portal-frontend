export default {
  options: {
    id: 'dependency-list'
  },
  handler: async (request, h) => {
    const entity = request.params.entity

    const rows = [
      {
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        dependency: 'pino',
        dependencyVersion: '2.4.5',
        dependencyType: 'npm'
      },
      {
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        dependency: 'chalk',
        dependencyVersion: '12.0.5',
        dependencyType: 'npm'
      },
      {
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        dependency: '@hapi/hapi',
        dependencyVersion: '18.4.5',
        dependencyType: 'npm'
      },
      {
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        dependency: '@hapi/jwt',
        dependencyVersion: '3.4.5',
        dependencyType: 'npm'
      },
      {
        entityVersion: '2.1.0',
        entityVersionTag: 'latest',
        dependency: 'nodejs',
        dependencyVersion: '23.1.5',
        dependencyType: 'binary'
      }
    ]

    return h.view('dependency-explorer/views/dependencies-list', {
      pageTitle: `Dependencies Explorer - ${entity}`,
      entity,
      tableData: {
        headers: [
          {
            id: 'version',
            text: 'Version',
            width: 10
          },
          {
            id: 'dependency',
            text: 'Dependency',
            width: 15
          },
          { id: 'dependencyVersion', text: 'Dependency version', width: 10 },
          { id: 'dependencyType', text: 'Dependency type', width: 10 }
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
