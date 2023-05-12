import { renderComponent } from '~/test-helpers/component-helpers'
import { transformDeployedServicesToEntityRow } from '~/src/app/deployed-services/transformers/transform-deployed-services-to-entity-row'
import { deployedServicesFixture } from '~/src/__fixtures__/deployed-services'

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
          { text: 'Environment', size: 'small' },
          { text: 'Version', size: 'small' },
          { text: 'Status', size: 'small' },
          { text: 'By', size: 'small' },
          { text: 'On', size: 'large' }
        ],
        entityRows: [deployedServicesFixture.at(0)].map(
          transformDeployedServicesToEntityRow
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
      expect(getHeader(2).text().trim()).toEqual('Environment')
      expect(getHeader(3).text().trim()).toEqual('Version')
      expect(getHeader(4).text().trim()).toEqual('Status')
      expect(getHeader(5).text().trim()).toEqual('By')
      expect(getHeader(6).text().trim()).toEqual('On')
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
      expect(getItem(5).attr('class')).toContain('app-entity-list__item--small')
      expect(getItem(6).attr('class')).toContain('app-entity-list__item--large')
    })

    test('Should contain expected entities', () => {
      const getEntity = (entityNumber) =>
        $entityList('[data-testid="app-entity-list-row-1"]').find(
          `[data-testid="app-entity-${entityNumber}"]`
        )
      expect(getEntity(1).length).toEqual(1)
      expect(getEntity(1).html()).toContain('FFC Grants Cattle Housing Web')

      expect(getEntity(2).length).toEqual(1)
      expect(getEntity(2).html()).toContain('production')

      expect(getEntity(3).length).toEqual(1)
      expect(getEntity(3).html()).toContain('1.0.0')

      expect(getEntity(4).length).toEqual(1)
      expect(getEntity(4).html()).toContain('Deployed')

      expect(getEntity(5).length).toEqual(1)
      expect(getEntity(5).html()).toContain('RoboCop')

      expect(getEntity(6).length).toEqual(1)
      expect(getEntity(6).html()).toContain(
        '2:40 pm on Tuesday 11th April 2023'
      )
    })
  })

  describe('Without entities', () => {
    beforeEach(() => {
      $entityList = renderComponent('entity-list', {
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
