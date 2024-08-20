import { renderTestComponent } from '~/test-helpers/component-helpers'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'
import { deploymentEntityRows } from '~/src/server/deployments/transformers/deployment-entity-rows'

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
        headings: [
          { text: 'Service', size: 'large' },
          { text: 'Version', size: 'small' },
          { text: 'Status', size: 'small' },
          { text: 'By', size: 'small' },
          { text: 'On', size: 'large' }
        ],
        entityRows: deploymentEntityRows([deploymentsFixture.data.at(0)]),
        noResult: 'Currently there are no deployed microservices'
      })
    })

    test('Should render app entity list component', () => {
      expect($entityList('[data-testid="app-entity-list"]')).toHaveLength(1)
    })

    test('Should contain expected headings', () => {
      const getHeader = (headerNumber) =>
        $entityList(
          `[data-testid="app-entity-list-header"] [data-testid="app-entity-list-item-${headerNumber}"]`
        )

      expect(getHeader(1).text().trim()).toBe('Service')
      expect(getHeader(2).text().trim()).toBe('Version')
      expect(getHeader(3).text().trim()).toBe('Status')
      expect(getHeader(4).text().trim()).toBe('By')
      expect(getHeader(5).text().trim()).toBe('On')
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

      expect(getEntity(1)).toHaveLength(1)
      expect(getEntity(1).html()).toContain('cdp-self-service-ops')

      expect(getEntity(2)).toHaveLength(1)
      expect(getEntity(2).html()).toContain('')

      expect(getEntity(3)).toHaveLength(1)
      expect(getEntity(3).html()).toContain('0.133.0')

      expect(getEntity(4)).toHaveLength(1)
      expect(getEntity(4).html()).toContain('Running')

      expect(getEntity(5)).toHaveLength(1)
      expect(getEntity(5).html()).toContain('B. A. Baracus')

      expect(getEntity(6)).toHaveLength(1)
      expect(getEntity(6).html()).toContain('Thu 14th Dec 2023 at 14:04')
    })
  })

  describe('Without entities', () => {
    beforeEach(() => {
      $entityList = renderTestComponent('entity-list', {
        headings: [],
        items: [],
        noResult: 'Currently there are no deployed microservices'
      })
    })

    test('Should render no results message', () => {
      expect(
        $entityList('[data-testid="app-entity-list-no-results"]')
      ).toHaveLength(1)
      expect(
        $entityList('[data-testid="app-entity-list-no-results"]').text().trim()
      ).toBe('Currently there are no deployed microservices')
    })
  })
})
