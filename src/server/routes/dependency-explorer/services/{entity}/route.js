import { scopes } from '@defra/cdp-validation-kit'
import { getEntityDependencies } from '../../DependencyService.js'

export const options = {
  id: 'dependency-list',
  // TODO: Remove
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin
    }
  }
}

export default async function (request) {
  const entity = request.params.entity

  const dependencies = await getEntityDependencies(entity)
  const rows = dependencies.map((dependency) => ({
    entityVersion: dependency.entityversion,
    entityTags: dependency.entitytags,
    dependency: dependency.name,
    dependencyVersion: dependency.version,
    dependencyType: dependency.type
  }))

  return {
    pageTitle: `Dependencies Explorer - ${entity}`,
    entity,
    tableData: {
      headers: [
        {
          id: 'version',
          text: 'Service version',
          width: 10
        },
        { id: 'dependencyType', text: 'Dependency type', width: 10 },
        {
          id: 'dependency',
          text: 'Dependency name',
          width: 20
        },
        { id: 'dependencyVersion', text: 'Dependency version', width: 10 }
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
        text: 'Services'
      },
      {
        text: entity
      }
    ]
  }
}
