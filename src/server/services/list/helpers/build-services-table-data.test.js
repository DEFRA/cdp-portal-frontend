import nock from 'nock'

import { config } from '~/src/config/config.js'
import { buildServicesTableData } from '~/src/server/services/list/helpers/build-services-table-data.js'
import { servicesFiltersFixture } from '~/src/__fixtures__/services/services-filters.js'
import { inProgressFiltersFixture } from '~/src/__fixtures__/status/in-progress-filters.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { repositoriesFixture } from '~/src/__fixtures__/repositories.js'
import { inProgressStatusFixture } from '~/src/__fixtures__/status/in-progress.js'

const expectRowHasService = (row, serviceName) =>
  expect(row).toEqual(
    expect.objectContaining({
      cells: expect.arrayContaining([
        expect.objectContaining({
          entity: expect.objectContaining({
            value: serviceName
          })
        })
      ])
    })
  )

const expectFilterHasValue = (filterPosition, serviceName) =>
  expect(filterPosition).toEqual(expect.objectContaining({ text: serviceName }))

const portalBackendUrl = config.get('portalBackendUrl')
const selfServiceOpsUrl = config.get('selfServiceOpsUrl')

const servicesFiltersEndpointUrl = new URL(
  `${portalBackendUrl}/services/filters`
)
const inProgressFiltersEndpointUrl = new URL(
  `${selfServiceOpsUrl}/status/in-progress/filters`
)
const deployableServicesEndpointUrl = new URL(`${portalBackendUrl}/services`)
const inProgressServicesEndpointUrl = new URL(
  `${selfServiceOpsUrl}/status/in-progress`
)
const repositoriesEndpointUrl = new URL(`${portalBackendUrl}/repositories`)

describe('#buildServicesTableData', () => {
  const oidcAdminGroupId = config.get('oidcAdminGroupId')
  const userScopeUUIDs = [oidcAdminGroupId]

  beforeEach(() => {
    // Provide mock response for API calls
    nock(servicesFiltersEndpointUrl.origin)
      .get(servicesFiltersEndpointUrl.pathname)
      .reply(200, servicesFiltersFixture)

    nock(inProgressFiltersEndpointUrl.origin)
      .get(inProgressFiltersEndpointUrl.pathname)
      .query({ kind: 'microservice' })
      .reply(200, inProgressFiltersFixture)

    nock(inProgressServicesEndpointUrl.origin)
      .get(inProgressServicesEndpointUrl.pathname)
      .query({ kind: 'microservice' })
      .reply(200, inProgressStatusFixture)

    nock(repositoriesEndpointUrl.origin)
      .get(repositoriesEndpointUrl.pathname)
      .reply(200, repositoriesFixture)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('When authenticated', () => {
    beforeEach(() => {
      nock(deployableServicesEndpointUrl.origin)
        .get(deployableServicesEndpointUrl.pathname)
        .reply(200, servicesFixture)
    })

    describe('Without query params', () => {
      let result

      beforeEach(async () => {
        result = await buildServicesTableData({
          isAuthenticated: true,
          userScopeUUIDs
        })
      })

      test('Should provide expected structure', () => {
        expect(result).toHaveProperty('rows')
        expect(result).toHaveProperty('filters')
        expect(result.filters).toHaveProperty('service')
        expect(result.filters).toHaveProperty('team')
      })

      test('Should provide expected filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-user-service-backend')
        expectFilterHasValue(serviceFilters.at(3), 'forms-designer')
        expectFilterHasValue(serviceFilters.at(4), 'new-service-one')
        expectFilterHasValue(serviceFilters.at(5), 'new-service-two')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Animals')
        expectFilterHasValue(teamFilters.at(2), 'Forms')
        expectFilterHasValue(teamFilters.at(3), 'Platform')
      })

      test('Should provide rows with "Platform" team services first', () => {
        expectRowHasService(result.rows.at(0), 'cdp-portal-frontend')
        expectRowHasService(result.rows.at(1), 'cdp-user-service-backend')
        expectRowHasService(result.rows.at(2), 'new-service-one')
        expectRowHasService(result.rows.at(3), 'new-service-two')
        expectRowHasService(result.rows.at(4), 'forms-designer')
      })

      test('Should provide expected rows', () => {
        expect(result.rows).toHaveLength(5)
      })

      test('Should provide expected row structure', () => {
        expect(result.rows.at(0)).toEqual(
          expect.objectContaining({
            cells: expect.arrayContaining([
              expect.objectContaining({ headers: 'owner' }),
              expect.objectContaining({ headers: 'service' }),
              expect.objectContaining({ headers: 'team' }),
              expect.objectContaining({ headers: 'kind' }),
              expect.objectContaining({ headers: 'Language' }),
              expect.objectContaining({ headers: 'GitHub Repository' }),
              expect.objectContaining({ headers: 'created' })
            ])
          })
        )
      })
    })

    describe('With service query param', () => {
      let result

      beforeEach(async () => {
        // return no services
        nock(deployableServicesEndpointUrl.origin)
          .get(deployableServicesEndpointUrl.pathname)
          .query({ service: 'new-service-two' })
          .reply(200, [])

        // return 'new-service-two' status only
        nock(inProgressServicesEndpointUrl.origin)
          .get(inProgressServicesEndpointUrl.pathname)
          .query({ kind: 'microservice', service: 'new-service-two' })
          .reply(200, {
            inProgress: [
              inProgressStatusFixture.inProgress.find(
                (item) => item.repositoryName === 'new-service-two'
              )
            ]
          })

        result = await buildServicesTableData({
          service: 'new-service-two',
          isAuthenticated: true,
          userScopeUUIDs
        })
      })

      test('With single result, Should provide all filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-user-service-backend')
        expectFilterHasValue(serviceFilters.at(3), 'forms-designer')
        expectFilterHasValue(serviceFilters.at(4), 'new-service-one')
        expectFilterHasValue(serviceFilters.at(5), 'new-service-two')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Animals')
        expectFilterHasValue(teamFilters.at(2), 'Forms')
        expectFilterHasValue(teamFilters.at(3), 'Platform')
      })

      test('Should provide expected single matching row', () => {
        expectRowHasService(result.rows.at(0), 'new-service-two')

        expect(result.rows).toHaveLength(1)
      })
    })

    describe('With teamId query param', () => {
      let result

      beforeEach(async () => {
        // Provide admin only services
        nock(deployableServicesEndpointUrl.origin)
          .get(deployableServicesEndpointUrl.pathname)
          .query({ teamId: oidcAdminGroupId })
          .reply(
            200,
            servicesFixture.filter((item) =>
              item.teams.some((team) => team.teamId === oidcAdminGroupId)
            )
          )
        // Provide admin only service status
        nock(inProgressServicesEndpointUrl.origin)
          .get(inProgressServicesEndpointUrl.pathname)
          .query({ kind: 'microservice', teamId: oidcAdminGroupId })
          .reply(200, {
            inProgress: inProgressStatusFixture.inProgress.filter(
              (item) => item.team.teamId === oidcAdminGroupId
            )
          })

        result = await buildServicesTableData({
          teamId: oidcAdminGroupId,
          isAuthenticated: true,
          userScopeUUIDs
        })
      })

      test('Should provide all filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-user-service-backend')
        expectFilterHasValue(serviceFilters.at(3), 'forms-designer')
        expectFilterHasValue(serviceFilters.at(4), 'new-service-one')
        expectFilterHasValue(serviceFilters.at(5), 'new-service-two')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Animals')
        expectFilterHasValue(teamFilters.at(2), 'Forms')
        expectFilterHasValue(teamFilters.at(3), 'Platform')
      })

      test('Should provide "Platform" only teams', () => {
        expectRowHasService(result.rows.at(0), 'cdp-portal-frontend')
        expectRowHasService(result.rows.at(1), 'cdp-user-service-backend')
        expectRowHasService(result.rows.at(2), 'new-service-one')
        expectRowHasService(result.rows.at(3), 'new-service-two')

        expect(result.rows).toHaveLength(4)
      })
    })
  })

  describe('When not authenticated', () => {
    let result

    beforeEach(async () => {
      nock(deployableServicesEndpointUrl.origin)
        .get(deployableServicesEndpointUrl.pathname)
        .reply(200, servicesFixture)

      result = await buildServicesTableData({
        isAuthenticated: false,
        userScopeUUIDs: []
      })
    })

    test('Should provide alphabetically listed rows', () => {
      expectRowHasService(result.rows.at(0), 'cdp-portal-frontend')
      expectRowHasService(result.rows.at(1), 'cdp-user-service-backend')
      expectRowHasService(result.rows.at(2), 'forms-designer')
      expectRowHasService(result.rows.at(3), 'new-service-one')
      expectRowHasService(result.rows.at(4), 'new-service-two')
    })
  })
})
