import { renderTestComponent } from '~/test-helpers/component-helpers'
import { transformDeploymentsToEntityRow } from '~/src/server/deployments/transformers/transform-deployments-to-entity-row'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'

describe('Entity List Component', () => {
  let $entityList

  describe('With entities', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('2023-04-01'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      $entityList = renderTestComponent('entity-list', {
        id: 'services',
        headings: [
          { text: 'Service', size: 'large' },
          { text: 'Version', size: 'small' },
          { text: 'Status', size: 'small' },
          { text: 'By', size: 'small' },
          { text: 'On', size: 'large' }
        ],
        entityRows: [deploymentsFixture.at(0)].map(
          transformDeploymentsToEntityRow
        ),
        noResult: 'Currently there are no deployed micro-services'
      })
    })

    test('Should render app entity list component', () => {
      expect($entityList('[data-testid="app-entity-list"]').length).toEqual(1)
    })

    test('Should contain expected headings', () => {
      const getHeader = (headerNumber) =>
        $entityList(
          `[data-testid="app-entity-list-header"] [data-testid="app-entity-list-item-${headerNumber}"]`
        )

      expect(getHeader(1).text().trim()).toEqual('Service')
      expect(getHeader(2).text().trim()).toEqual('Version')
      expect(getHeader(3).text().trim()).toEqual('Status')
      expect(getHeader(4).text().trim()).toEqual('By')
      expect(getHeader(5).text().trim()).toEqual('On')
    })

    test('Rows should contain expected size className', () => {
      const getItem = (itemNumber) =>
        $entityList(
          `[data-testid="app-entity-list-row-1"] [data-testid="app-entity-list-item-${itemNumber}"]`
        )

      expect(getItem(1).attr('class')).toContain('app-entity-list__item--large')
      expect(getItem(2).attr('class')).toContain('app-entity-list__item--small')
      expect(getItem(3).attr('class')).toContain('app-entity-list__item--small')
      expect(getItem(4).attr('class')).toContain('app-entity-list__item--small')
      expect(getItem(5).attr('class')).toContain('app-entity-list__item--large')
    })

    test('Should contain expected entities', () => {
      const getEntity = (entityNumber) =>
        $entityList('[data-testid="app-entity-list-row-1"]').find(
          `[data-testid="app-entity-${entityNumber}"]`
        )

      expect(getEntity(1).length).toEqual(1)
      expect(getEntity(1).html()).toContain('cdp-teams-and-repositories')

      expect(getEntity(2).length).toEqual(1)
      expect(getEntity(2).html()).toContain('0.2.0')

      expect(getEntity(3).length).toEqual(1)
      expect(getEntity(3).html()).toContain('RUNNING')

      expect(getEntity(4).length).toEqual(1)
      expect(getEntity(4).html()).toContain('RoboCop')

      expect(getEntity(5).length).toEqual(1)
      expect(getEntity(5).html()).toContain('22:54:12 Thu 18th May 2023')
    })
  })

  describe('Without entities', () => {
    beforeEach(() => {
      $entityList = renderTestComponent('entity-list', {
        headings: [],
        items: [],
        noResult: 'Currently there are no deployed micro-services'
      })
    })

    test('Should render no results message', () => {
      expect(
        $entityList('[data-testid="app-entity-list-no-results"]').length
      ).toEqual(1)
      expect(
        $entityList('[data-testid="app-entity-list-no-results"]').text().trim()
      ).toEqual('Currently there are no deployed micro-services')
    })
  })
})
