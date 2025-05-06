import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { deploymentToEntityRow } from '~/src/server/deployments/transformers/deployment-to-entity-row.js'
import { deploymentsWithMigrationsFixture } from '~/src/__fixtures__/deployments/deployments-with-migrations.js'

describe('#deploymentToEntityRow', () => {
  const adminGroupId = 'aabe63e7-87ef-4beb-a596-c810631fc474'
  const userScopeUUIDs = [adminGroupId]
  const deploymentsDecorator = decorateDeployments({
    deployableServices: servicesFixture,
    userScopeUUIDs
  })
  const deploymentsWithTeams = deploymentsDecorator(
    deploymentsWithMigrationsFixture.data
  )

  describe('When authenticated', () => {
    test('Should provide expected table rows', () => {
      const rowBuilder = deploymentToEntityRow(true)

      expect(deploymentsWithTeams.map(rowBuilder)).toEqual([
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: expect.stringContaining('Favourite microservice')
              },
              headers: 'owner',
              isCentered: true
            },
            {
              headers: 'description',
              html: expect.stringContaining('cdp-example-node-postgres-be')
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.356.0',
                value: '0.356.0'
              },
              headers: 'version'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'status'
            },
            {
              entity: {
                classes: 'govuk-tag--blue',
                kind: 'tag',
                value: 'Deployment'
              },
              headers: 'kind'
            },
            {
              entity: {
                kind: 'text',
                value: 'Mumm-ra'
              },
              headers: 'by'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2025-04-30T14:48:34.001Z',
                withSeconds: true
              },
              headers: 'started'
            }
          ]
        },
        {
          cells: [
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: expect.stringContaining('Favourite microservice')
              },
              headers: 'owner',
              isCentered: true
            },
            {
              headers: 'description',
              html: expect.stringContaining('cdp-example-node-postgres-be')
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.8.0',
                value: '0.8.0'
              },
              headers: 'version'
            },
            {
              entity: {
                classes: 'govuk-tag--grey',
                kind: 'tag',
                value: 'Succeeded'
              },
              headers: 'status'
            },
            {
              entity: {
                classes: 'govuk-tag--blue',
                kind: 'tag',
                value: 'Deployment'
              },
              headers: 'kind'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'by'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2025-04-30T09:21:54.816Z',
                withSeconds: true
              },
              headers: 'started'
            }
          ]
        }
      ])
    })
  })

  describe('When not authenticated', () => {
    test('Should provide expected table rows', () => {
      const rowBuilder = deploymentToEntityRow(false)

      expect(deploymentsWithTeams.map(rowBuilder)).toEqual([
        {
          cells: [
            {
              headers: 'description',
              html: expect.stringContaining('cdp-example-node-postgres-be')
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.356.0',
                value: '0.356.0'
              },
              headers: 'version'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                value: 'Running'
              },
              headers: 'status'
            },
            {
              entity: {
                classes: 'govuk-tag--blue',
                kind: 'tag',
                value: 'Deployment'
              },
              headers: 'kind'
            },
            {
              entity: {
                kind: 'text',
                value: 'Mumm-ra'
              },
              headers: 'by'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2025-04-30T14:48:34.001Z',
                withSeconds: true
              },
              headers: 'started'
            }
          ]
        },
        {
          cells: [
            {
              headers: 'description',
              html: expect.stringContaining('cdp-example-node-postgres-be')
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-example-node-postgres-be/releases/tag/0.8.0',
                value: '0.8.0'
              },
              headers: 'version'
            },
            {
              entity: {
                classes: 'govuk-tag--grey',
                kind: 'tag',
                value: 'Succeeded'
              },
              headers: 'status'
            },
            {
              entity: {
                classes: 'govuk-tag--blue',
                kind: 'tag',
                value: 'Deployment'
              },
              headers: 'kind'
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'by'
            },
            {
              entity: {
                kind: 'group',
                value: null
              },
              headers: 'team'
            },
            {
              entity: {
                kind: 'date',
                value: '2025-04-30T09:21:54.816Z',
                withSeconds: true
              },
              headers: 'started'
            }
          ]
        }
      ])
    })
  })
})
