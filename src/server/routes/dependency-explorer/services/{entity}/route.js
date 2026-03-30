import { scopes } from '@defra/cdp-validation-kit'
import { getEntityDependencies } from '../../DependencyService.js'
import { getDependencyTypes } from '../../FilterService.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

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

  const [dependencies, dependencyTypes] = await Promise.all([
    getEntityDependencies(entity, request.query),
    getDependencyTypes()
  ])

  const dependencyTypeOptions = buildOptions(dependencyTypes)

  const pageUrl = request.routeLookup('dependency-list', {
    params: { entity }
  })

  const rows = dependencies.map((dependency) => ({
    entityVersion: dependency.entityversion,
    entityTags: dependency.entitytags,
    dependencyName: dependency.name,
    dependencyVersion: dependency.version,
    dependencyType: dependency.type
  }))

  return {
    pageTitle: `Dependencies Explorer - ${entity}`,
    query: request.query,
    pageUrl,
    entity,
    dependencyTypeOptions,
    tableData: {
      headers: [
        {
          id: 'version',
          text: 'Service version',
          width: 10
        },
        { id: 'dependencyType', text: 'Dependency type', width: 10 },
        {
          id: 'dependencyName',
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
