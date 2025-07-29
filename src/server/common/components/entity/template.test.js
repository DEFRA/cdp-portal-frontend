import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Entity Component', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

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
      expect($linkEntity.find('[data-testid="app-entity-link"]')).toHaveLength(
        1
      )
    })

    test('Link should have expected link text', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').text().trim()
      ).toBe('Rod License Service')
    })

    test('Link should have expected "href"', () => {
      expect(
        $linkEntity.find('[data-testid="app-entity-link"]').attr('href')
      ).toBe('/deployments/12345678')
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
      ).toBe('_blank')
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
      expect($tagEntity.find('[data-testid="govuk-tag"]')).toHaveLength(1)
    })

    test('Should contain expected content', () => {
      expect($tagEntity.text().trim()).toBe('Production')
    })
  })

  describe('Tag entity with link', () => {
    let $tagEntity

    beforeEach(() => {
      $tagEntity = renderTestComponent('entity', {
        kind: 'tag',
        value: 'Production',
        classes: 'govuk-tag--blue',
        size: 'medium',
        url: 'https://chocolate.com',
        newWindow: true
      })('[data-testid="app-entity"]').first()
    })

    test('Should render GovUK Tag component wrapped in a link', () => {
      expect($tagEntity.find('[data-testid="app-entity-link"]')).toHaveLength(1)
    })

    test('Should contain expected href', () => {
      expect(
        $tagEntity.find('[data-testid="app-entity-link"]').attr('href')
      ).toBe('https://chocolate.com')
    })

    test('Should contain expected target', () => {
      expect(
        $tagEntity.find('[data-testid="app-entity-link"]').attr('target')
      ).toBe('_blank')
    })
  })

  describe('Date entity', () => {
    let $dateEntity

    beforeAll(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-04-01'))
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    beforeEach(() => {
      $dateEntity = renderTestComponent('entity', {
        kind: 'date',
        value: '2023-04-11T14:40:02.242Z',
        size: 'large'
      })('[data-testid="app-entity"]').first()
    })

    test('Should render app time component', () => {
      expect($dateEntity.find('[data-testid="app-time"]')).toHaveLength(1)
    })

    test('Should contain expected rendered date', () => {
      expect($dateEntity.find('[data-testid="app-time"]').text().trim()).toBe(
        'Tue 11th Apr 2023 at 14:40'
      )
    })

    test('Should have expected datetime attribute', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').attr('datetime')
      ).toBe('2023-04-11T14:40:02.242Z')
    })
  })

  describe('Date entity with custom formatString', () => {
    let $dateEntity

    beforeAll(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-04-01'))
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    beforeEach(() => {
      $dateEntity = renderTestComponent('entity', {
        kind: 'date',
        value: '2024-04-11T14:40:02.242Z',
        size: 'large',
        withSeconds: true
      })('[data-testid="app-entity"]').first()
    })

    test('Should render app time component', () => {
      expect($dateEntity.find('[data-testid="app-time"]')).toHaveLength(1)
    })

    test('Should contain expected rendered date', () => {
      expect($dateEntity.find('[data-testid="app-time"]').text().trim()).toBe(
        'Thu 11th Apr 2024 at 14:40:02'
      )
    })

    test('Should have expected datetime attribute', () => {
      expect(
        $dateEntity.find('[data-testid="app-time"]').attr('datetime')
      ).toBe('2024-04-11T14:40:02.242Z')
    })
  })

  describe('Text entity', () => {
    let $textEntity

    beforeEach(() => {
      $textEntity = renderTestComponent('entity', {
        kind: 'text',
        value: '0.1.0',
        size: 'small',
        title: 'Something wonderful here'
      })('[data-testid="app-entity-text"]').first()
    })

    test('Should render as expected', () => {
      expect($textEntity.text().trim()).toBe('0.1.0')
    })

    test('Should render with expected title', () => {
      expect($textEntity.attr('title')).toBe('Something wonderful here')
    })
  })

  describe('Html entity', () => {
    let $htmlEntity

    beforeEach(() => {
      $htmlEntity = renderTestComponent('entity', {
        kind: 'html',
        value: '<p data-testid="app-entity-html">Green tea rocks</p>'
      })('[data-testid="app-entity-html"]').first()
    })

    test('Should render as expected', () => {
      expect($htmlEntity.text().trim()).toBe('Green tea rocks')
    })
  })

  describe('List entity', () => {
    let $listEntity
    let $dateEntity
    let $linkEntity

    beforeEach(() => {
      $listEntity = renderTestComponent('entity', {
        kind: 'list',
        value: [
          {
            kind: 'date',
            value: '2023-04-12T17:16:48+00:00'
          },
          {
            kind: 'link',
            url: '/animal/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Super animals'
          }
        ]
      })('[data-testid="app-entity"]').first()

      $dateEntity = $listEntity.find('[data-testid="app-time"]')
      $linkEntity = $listEntity.find('[data-testid="app-entity-link"]')
    })

    test('Should render expected time entity', () => {
      expect($dateEntity.text().trim()).toBe('Wed 12th Apr 2023 at 17:16')
    })

    test('Link should have expected link text', () => {
      expect($linkEntity.text().trim()).toBe('Super animals')
    })

    test('Link should have expected "href"', () => {
      expect($linkEntity.attr('href')).toBe(
        '/animal/aabe63e7-87ef-4beb-a596-c810631fc474'
      )
    })
  })

  describe('Group entity', () => {
    let $groupEntity
    let $firstTag
    let $secondTag

    beforeEach(() => {
      $groupEntity = renderTestComponent('entity', {
        kind: 'group',
        value: [
          {
            kind: 'tag',
            value: 'Frontend'
          },
          {
            kind: 'tag',
            value: 'Backend'
          }
        ]
      })('[data-testid="app-entity"]').first()

      $firstTag = $groupEntity.find('[data-testid="govuk-tag"]').first()
      $secondTag = $groupEntity.find('[data-testid="govuk-tag"]').eq(1)
    })

    test('Should render expected first tag entity', () => {
      expect($firstTag.text().trim()).toBe('Frontend')
    })

    test('Link should have expected second tag entity', () => {
      expect($secondTag.text().trim()).toBe('Backend')
    })
  })
})
