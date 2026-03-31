import { scopes } from '@defra/cdp-validation-kit'
import { getEntityDependencies } from '../../DependencyService.js'
import { getDependencyTypes } from '../../FilterService.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { buildPagination } from '#server/common/helpers/build-pagination.js'
import { pagination } from '#server/common/constants/pagination.js'
import Joi from 'joi'

export const options = {
  id: 'dependency-list',
  // TODO: Remove
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin
    }
  },
  validate: {
    query: Joi.object({
      page: Joi.number(),
      size: Joi.number()
    }).unknown()
  }
}

export default async function (request) {
  const entity = request.params.entity
  const page = request.query?.page ?? pagination.page
  const size = request.query?.size ?? pagination.size

  const [{ results: dependencies, meta }, dependencyTypes] = await Promise.all([
    getEntityDependencies(entity, request.query),
    getDependencyTypes()
  ])

  const totalItems = meta.total ?? 0
  const totalPages = meta.totalPages ?? 1

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
    totalItems,
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
      pagination: buildPagination(page, size, totalPages, request.query),
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
