import { renderComponent } from '~/test-helpers/component-helpers'

describe('Entity Component', () => {
  describe('Entity', () => {
    let $entity

    beforeEach(() => {
      $entity = renderComponent('entity', {
        kind: 'text',
        value: 'Rod License Service',
        size: 'large',
        label: 'Service'
      })('[data-test-id="app-entity"]').first()
    })

    test('Should render with expected label', () => {
      expect(
        $entity.find('[data-test-id="app-entity-label"]').text()
      ).toContain('Service')
    })
  })

  describe('Link entity', () => {
    let $linkEntity

    beforeEach(() => {
      $linkEntity = renderComponent('entity', {
        kind: 'link',
        value: 'Rod License Service',
        url: '/deployments/12345678',
        size: 'large'
      })('[data-test-id="app-entity"]').first()
    })

    test('Should render with a link', () => {
      expect(
        $linkEntity.find('[data-test-id="app-entity-link"]').length
      ).toEqual(1)
    })

    test('Link should have expected link text', () => {
      expect(
        $linkEntity.find('[data-test-id="app-entity-link"]').text().trim()
      ).toEqual('Rod License Service')
    })

    test('Link should have expected "href"', () => {
      expect(
        $linkEntity.find('[data-test-id="app-entity-link"]').attr('href')
      ).toEqual('/deployments/12345678')
    })

    test('Should not have target attribute', () => {
      expect(
        $linkEntity.find('[data-test-id="app-entity-link"]').attr('target')
      ).toBeUndefined()
    })
  })

  describe('External link entity', () => {
    let $linkEntity

    beforeEach(() => {
      $linkEntity = renderComponent('entity', {
        kind: 'link',
        value: 'Cracking service',
        url: '/services/09876543',
        size: 'medium',
        newWindow: true
      })('[data-test-id="app-entity"]').first()
    })

    test('Should not have target attribute', () => {
      expect(
        $linkEntity.find('[data-test-id="app-entity-link"]').attr('target')
      ).toEqual('_blank')
    })
  })

  describe('Tag entity', () => {
    let $tagEntity

    beforeEach(() => {
      $tagEntity = renderComponent('entity', {
        kind: 'tag',
        value: 'Production',
        classes: 'govuk-tag--blue',
        size: 'medium'
      })('[data-test-id="app-entity"]').first()
    })

    test('Should render GovUK Tag component', () => {
      expect($tagEntity.find('[data-test-id="govuk-tag"]').length).toEqual(1)
    })

    test('Should contain expected content', () => {
      expect($tagEntity.text().trim()).toEqual('Production')
    })
  })

  describe('Date entity', () => {
    let $dateEntity

    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('2023-04-01'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      $dateEntity = renderComponent('entity', {
        kind: 'date',
        value: '2023-04-11T14:40:02.242Z',
        size: 'large'
      })('[data-test-id="app-entity"]').first()
    })

    test('Should render app time component', () => {
      expect($dateEntity.find('[data-test-id="app-time"]').length).toEqual(1)
    })

    test('Should contain expected rendered date', () => {
      expect(
        $dateEntity.find('[data-test-id="app-time"]').text().trim()
      ).toEqual('2:40 pm on Tuesday 11th April 2023')
    })

    test('Should have expected datetime attribute', () => {
      expect(
        $dateEntity.find('[data-test-id="app-time"]').attr('datetime')
      ).toEqual('2023-04-11T14:40:02.242Z')
    })
  })

  describe('Text entity', () => {
    let $textEntity

    beforeEach(() => {
      $textEntity = renderComponent('entity', {
        kind: 'text',
        value: '0.1.0',
        size: 'small'
      })('[data-test-id="app-entity"]').first()
    })

    test('Should render as expected', () => {
      expect($textEntity.text().trim()).toEqual('0.1.0')
    })
  })
})
