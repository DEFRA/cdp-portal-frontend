import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Entity Component', () => {
  describe('Entity', () => {
    let $entity

    beforeEach(() => {
      $entity = renderTestComponent('entity', {
        kind: 'text',
        value: 'Rod License Service',
        size: 'large',
        label: 'Service'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render with expected label', () => {
      expect($entity.find('[data-testid="app-entity-label"]').text()).toContain(
        'Service'
      )
    })
  })

  describe('Link entity', () => {
    let $linkEntity

    beforeEach(() => {
      $linkEntity = renderTestComponent('entity', {
        kind: 'link',
        value: 'Rod License Service',
        url: '/deployments/12345678',
        size: 'large'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render with a link', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').length
      ).toEqual(1)
    })

    test('Link should have expected link text', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').text().trim()
      ).toEqual('Rod License Service')
    })

    test('Link should have expected "href"', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').attr('href')
      ).toEqual('/deployments/12345678')
    })

    test('Should not have target attribute', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').attr('target')
      ).toBeUndefined()
    })
  })

  describe('External link entity', () => {
    let $linkEntity

    beforeEach(() => {
      $linkEntity = renderTestComponent('entity', {
        kind: 'link',
        value: 'Cracking service',
        url: '/services/09876543',
        size: 'medium',
        newWindow: true
      })('[data-testid="app-entity"]').first()
    })

    test('Should not have target attribute', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').attr('target')
      ).toEqual('_blank')
    })
  })

  describe('Tag entity', () => {
    let $tagEntity

    beforeEach(() => {
      $tagEntity = renderTestComponent('entity', {
        kind: 'tag',
        value: 'Production',
        classes: 'govuk-tag--blue',
        size: 'medium'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render GovUK Tag component', () => {
      expect($tagEntity.find('[data-testid="govuk-tag"]').length).toEqual(1)
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
      $dateEntity = renderTestComponent('entity', {
        kind: 'date',
        value: '2023-04-11T14:40:02.242Z',
        size: 'large'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render app time component', () => {
      expect($dateEntity.find('[data-testid="app-time"]').length).toEqual(1)
    })

    test('Should contain expected rendered date', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').text().trim()
      ).toEqual('14:40 Tue 11th Apr 2023')
    })

    test('Should have expected datetime attribute', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').attr('datetime')
      ).toEqual('2023-04-11T14:40:02.242Z')
    })
  })

  describe('Date entity with custom formatString', () => {
    let $dateEntity

    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date('2023-04-01'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      $dateEntity = renderTestComponent('entity', {
        kind: 'date',
        value: '2024-04-11T14:40:02.242Z',
        size: 'large',
        formatString: 'k:mm:ss EE do MMM yyyy'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render app time component', () => {
      expect($dateEntity.find('[data-testid="app-time"]').length).toEqual(1)
    })

    test('Should contain expected rendered date', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').text().trim()
      ).toEqual('14:40:02 Thu 11th Apr 2024')
    })

    test('Should have expected datetime attribute', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').attr('datetime')
      ).toEqual('2024-04-11T14:40:02.242Z')
    })
  })

  describe('Text entity', () => {
    let $textEntity

    beforeEach(() => {
      $textEntity = renderTestComponent('entity', {
        kind: 'text',
        value: '0.1.0',
        size: 'small'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render as expected', () => {
      expect($textEntity.text().trim()).toEqual('0.1.0')
    })
  })
})
