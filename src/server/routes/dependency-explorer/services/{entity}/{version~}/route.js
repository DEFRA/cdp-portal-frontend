import { getEntityDependencies } from '../../../DependencyService.js'
import { getDependencyTypes, getEntityStages } from '../../../FilterService.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { buildPagination } from '#server/common/helpers/build-pagination.js'
import { pagination } from '#server/common/constants/pagination.js'
import { fetchAvailableVersions } from '#server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import Joi from 'joi'

export const options = {
  id: 'dependency-version-list',
  validate: {
    query: Joi.object({
      page: Joi.number(),
      size: Joi.number()
    }).unknown()
  }
}

export default async function (request) {
  const entity = request.params.entity
  const version = request.params.version
  const page = request.query?.page ?? pagination.page
  const size = request.query?.size ?? pagination.size

  const [dependencyTypes, availableVersions, entityStages] = await Promise.all([
    getDependencyTypes(),
    fetchAvailableVersions(entity),
    getEntityStages()
  ])

  let rows = []
  let totalItems = 0
  let totalPages = 1

  if (version) {
    const { results: dependencies, meta } = await getEntityDependencies(
      entity,
      version,
      {
        stage: 'run',
        ...request.query
      }
    )

    totalItems = meta.total ?? 0
    totalPages = meta.totalPages ?? 1

    rows = dependencies.map((dependency) => ({
      entityStage: dependency.entitystage,
      dependencyName: dependency.name,
      dependencyVersion: dependency.version,
      dependencyType: dependency.type
    }))
  }

  const dependencyTypeOptions = buildOptions(dependencyTypes)
  const versionOptions = buildOptions(
    availableVersions.map((version) => ({
      text: version.tag,
      value: version.tag
    }))
  )
  const entityStageOptions = buildOptions(
    entityStages.map((stage) => ({
      text: formatText(stage),
      value: stage
    }))
  )

  const pageUrl = request.routeLookup('dependency-version-list', {
    params: { entity, version }
  })

  return {
    pageTitle: `Dependencies Explorer - ${entity}`,
    query: request.query,
    pageUrl,
    entity,
    version,
    dependencyTypeOptions,
    versionOptions,
    entityStageOptions,
    totalItems,
    tableData: {
      headers: [
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

export async function POST(request, h) {
  const entity = request.params.entity
  const version = request.payload.version

  return h.redirect(
    request.routeLookup('dependency-version-list', {
      params: {
        entity: encodeURIComponent(entity),
        version: encodeURIComponent(version)
      },
      query: request.query
    })
  )
}
