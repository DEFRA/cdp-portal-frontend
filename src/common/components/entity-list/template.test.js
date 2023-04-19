import { renderComponent } from '~/test-helpers/component-helpers'
import { transformDeploymentsToEntities } from '~/src/app/deployments/transformers/transform-deployments-to-entities'
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
      $entityList = renderComponent('entity-list', {
        headings: [
          { text: 'Service', size: 'large' },
          { text: 'Version', size: 'small' },
          { text: 'Environment', size: 'small' },
          { text: 'Status', size: 'small' },
          { text: 'By', size: 'small' },
          { text: 'On', size: 'large' }
        ],
        items: [deploymentsFixture[0]].map(transformDeploymentsToEntities),
        noResult: 'Currently there are no deployments'
      })
    })

    test('Should render app entity list component', () => {
      expect($entityList('[data-test-id="app-entity-list"]').length).toEqual(1)
    })

    test('Should contain expected headings', () => {
      const getHeader = (headerNumber) =>
        $entityList(`[data-test-id="app-entity-list-item-${headerNumber}"]`)

      expect(getHeader(1).text().trim()).toEqual('Service')
      expect(getHeader(2).text().trim()).toEqual('Version')
      expect(getHeader(3).text().trim()).toEqual('Environment')
      expect(getHeader(4).text().trim()).toEqual('Status')
      expect(getHeader(5).text().trim()).toEqual('By')
      expect(getHeader(6).text().trim()).toEqual('On')
    })

    test('Should contain expected entities', () => {
      const getEntity = (entityNumber) =>
        $entityList('[data-test-id="app-entity-list-row-1"]').find(
          `[data-test-id="app-entity-${entityNumber}"]`
        )
      expect(getEntity(1).length).toEqual(1)
      expect(getEntity(1).html()).toContain('FFC Grants Cattle Housing Web')

      expect(getEntity(2).length).toEqual(1)
      expect(getEntity(2).html()).toContain('1.0.0')

      expect(getEntity(3).length).toEqual(1)
      expect(getEntity(3).html()).toContain('production')

      expect(getEntity(4).length).toEqual(1)
      expect(getEntity(4).html()).toContain('Deployed')

      expect(getEntity(5).length).toEqual(1)
      expect(getEntity(5).html()).toContain('RoboCop')

      expect(getEntity(6).length).toEqual(1)
      expect(getEntity(6).html()).toContain(
        '2:40:02pm on Tuesday 11th April 2023'
      )
    })
  })

  describe('Without entities', () => {
    beforeEach(() => {
      $entityList = renderComponent('entity-list', {
        headings: [],
        items: [],
        noResult: 'Currently there are no deployments'
      })
    })

    test('Should render no results message', () => {
      expect(
        $entityList('[data-test-id="app-entity-list-no-results"]').length
      ).toEqual(1)
      expect(
        $entityList('[data-test-id="app-entity-list-no-results"]').text().trim()
      ).toEqual('Currently there are no deployments')
    })
  })
})
