import nock from 'nock'

import { config } from '../../../../config/config.js'
import { buildServicesTableData } from './build-services-table-data.js'
import { entitiesFiltersFixture } from '../../../../__fixtures__/services/entities-filters.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

const expectRowHasService = (row, serviceName) =>
  expect(row).toEqual(
    expect.objectContaining({
      cells: expect.arrayContaining([
        expect.objectContaining({
          entity: expect.objectContaining({
            value: expect.stringContaining(serviceName)
          })
        })
      ])
    })
  )

const expectFilterHasValue = (filterPosition, serviceName) =>
  expect(filterPosition).toEqual(expect.objectContaining({ text: serviceName }))

const portalBackendUrl = config.get('portalBackendUrl')

const filtersEndpointUrl = new URL(`${portalBackendUrl}/entities/filters`)
const entitiesEndpointUrl = new URL(`${portalBackendUrl}/entities`)

describe('#buildServicesTableData', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const userScopeUUIDs = [adminGroupId]

  beforeEach(() => {
    // Provide mock response for API calls
    nock(filtersEndpointUrl.origin)
      .get(filtersEndpointUrl.pathname)
      .query({
        type: ['Microservice', 'Prototype'],
        status: ['Created', 'Creating']
      })
      .reply(200, entitiesFiltersFixture)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('When authenticated', () => {
    beforeEach(() => {
      nock(entitiesEndpointUrl.origin)
        .get(entitiesEndpointUrl.pathname)
        .query({
          type: ['Microservice', 'Prototype'],
          status: ['Created', 'Creating']
        })
        .reply(200, entityServicesFixture)
    })

    describe('Without query params', () => {
      let result

      beforeEach(async () => {
        result = await buildServicesTableData({
          userScopeUUIDs
        })
      })

      test('Should provide expected structure', () => {
        expect(result).toHaveProperty('rows')
        expect(result).toHaveProperty('servicesCount')
        expect(result).toHaveProperty('filters')
        expect(result.filters).toHaveProperty('service')
        expect(result.filters).toHaveProperty('team')
      })

      test('Should provide expected filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-backend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(3), 'cdp-portal-stubs')
        expectFilterHasValue(serviceFilters.at(4), 'forms-service')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Forms')
        expectFilterHasValue(teamFilters.at(2), 'Platform')
      })

      test('Should provide rows with "Platform" team services first', () => {
        expectRowHasService(result.rows.at(0), 'cdp-example-node-postgres-be')
        expectRowHasService(result.rows.at(1), 'cdp-portal-backend')
        expectRowHasService(result.rows.at(2), 'cdp-portal-frontend')
        expectRowHasService(result.rows.at(3), 'cdp-portal-stubs')
        expectRowHasService(result.rows.at(4), 'cdp-user-service-backend')
        expectRowHasService(result.rows.at(5), 'ai-service')
        expectRowHasService(result.rows.at(6), 'forms-designer')
      })

      test('Should provide expected rows', () => {
        expect(result.rows).toHaveLength(8)
      })

      test('Should provide expected row structure', () => {
        expect(result.rows.at(0)).toEqual(
          expect.objectContaining({
            cells: expect.arrayContaining([
              expect.objectContaining({ headers: 'owner' }),
              expect.objectContaining({ headers: 'service' }),
              expect.objectContaining({ headers: 'team' }),
              expect.objectContaining({ headers: 'kind' }),
              expect.objectContaining({ headers: 'created' })
            ])
          })
        )
      })

      test('Should provide expected service count', () => {
        expect(result.servicesCount).toBe(4)
      })
    })

    describe('With service query param', () => {
      let result

      beforeEach(async () => {
        // return no services
        nock(entitiesEndpointUrl.origin)
          .get(entitiesEndpointUrl.pathname)
          .query({
            type: ['Microservice', 'Prototype'],
            status: ['Created', 'Creating'],
            name: 'forms-service'
          })
          .reply(
            200,
            entityServicesFixture.filter(
              (item) => item.name === 'forms-service'
            )
          )

        result = await buildServicesTableData({
          service: 'forms-service',
          userScopeUUIDs
        })
      })

      test('With single result, should provide all filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-backend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(3), 'cdp-portal-stubs')
        expectFilterHasValue(serviceFilters.at(4), 'forms-service')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Forms')
        expectFilterHasValue(teamFilters.at(2), 'Platform')
      })

      test('Should provide expected single matching row', () => {
        expectRowHasService(result.rows.at(0), 'forms-service')

        expect(result.rows).toHaveLength(1)
      })

      test('Should provide expected service count', () => {
        expect(result.servicesCount).toBe(4)
      })
    })

    describe('With teamId query param', () => {
      let result

      beforeEach(async () => {
        // Provide admin only services
        nock(entitiesEndpointUrl.origin)
          .get(entitiesEndpointUrl.pathname)
          .query({
            type: ['Microservice', 'Prototype'],
            status: ['Created', 'Creating'],
            teamIds: adminGroupId
          })
          .reply(
            200,
            entityServicesFixture.filter((item) =>
              item.teams.some((team) => team.teamId === adminGroupId)
            )
          )

        result = await buildServicesTableData({
          teamId: adminGroupId,
          userScopeUUIDs
        })
      })

      test('Should provide all filters', () => {
        const serviceFilters = result.filters.service

        expectFilterHasValue(serviceFilters.at(1), 'cdp-portal-backend')
        expectFilterHasValue(serviceFilters.at(2), 'cdp-portal-frontend')
        expectFilterHasValue(serviceFilters.at(3), 'cdp-portal-stubs')
        expectFilterHasValue(serviceFilters.at(4), 'forms-service')

        const teamFilters = result.filters.team

        expectFilterHasValue(teamFilters.at(1), 'Forms')
        expectFilterHasValue(teamFilters.at(2), 'Platform')
      })

      test('Should provide "Platform" only teams', () => {
        expectRowHasService(result.rows.at(0), 'cdp-example-node-postgres-be')
        expectRowHasService(result.rows.at(1), 'cdp-portal-backend')
        expectRowHasService(result.rows.at(2), 'cdp-portal-frontend')
        expectRowHasService(result.rows.at(3), 'cdp-portal-stubs')
        expectRowHasService(result.rows.at(4), 'cdp-user-service-backend')

        expect(result.rows).toHaveLength(5)
      })

      test('Should provide expected service count', () => {
        expect(result.servicesCount).toBe(4)
      })
    })
  })

  describe('When not authenticated', () => {
    let result

    beforeEach(async () => {
      nock(entitiesEndpointUrl.origin)
        .get(entitiesEndpointUrl.pathname)
        .query({
          type: ['Microservice', 'Prototype'],
          status: ['Created', 'Creating']
        })
        .reply(200, entityServicesFixture)

      result = await buildServicesTableData({
        userScopeUUIDs: []
      })
    })

    test('Should provide alphabetically listed rows', () => {
      expectRowHasService(result.rows.at(0), 'ai-service')
      expectRowHasService(result.rows.at(1), 'cdp-example-node-postgres-be')
      expectRowHasService(result.rows.at(2), 'cdp-portal-backend')
      expectRowHasService(result.rows.at(3), 'cdp-portal-frontend')
      expectRowHasService(result.rows.at(4), 'cdp-portal-stubs')
      expectRowHasService(result.rows.at(5), 'cdp-user-service-backend')
      expectRowHasService(result.rows.at(6), 'forms-designer')
      expectRowHasService(result.rows.at(7), 'forms-service')
    })

    test('Should provide expected service count', () => {
      expect(result.servicesCount).toBe(4)
    })
  })
})
