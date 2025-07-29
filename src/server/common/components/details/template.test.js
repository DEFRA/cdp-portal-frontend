import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Details Component', () => {
  const detailsId = 'details-id'
  let $details
  let $content
  let $summary

  afterEach(() => {
    $details = null
    $content = null
    $summary = null
  })

  describe('Defaults', () => {
    beforeEach(() => {
      $details = renderTestComponent('details', {
        id: detailsId,
        summaryText: 'Hello Sunshine',
        text: 'Wall to wall sunshine coming for the UK in 2025!'
      })('[data-testid="app-details"]').first()
    })

    test('Should render with expected id', () => {
      expect($details.attr('id')).toBe(detailsId)
    })

    test('Should render with expected summary', () => {
      expect($details.find('summary').text()).toBe('Hello Sunshine')
    })

    test('Should render with expected text content', () => {
      expect(
        $details.find('[data-testid="app-details-content"]').text()
      ).toContain('Wall to wall sunshine coming for the UK in 2025!')
    })
  })

  describe('With html content', () => {
    beforeEach(() => {
      $details = renderTestComponent('details', {
        summaryHtml: 'Hello <strong>Trigger</strong>',
        html: 'Alright <em>dave?</em>'
      })('[data-testid="app-details"]').first()
      $summary = $details.find('summary')
      $content = $details.find('[data-testid="app-details-content"]')
    })

    test('Should render with expected html summary', () => {
      expect($summary.text()).toBe('Hello Trigger')
      expect($summary.html()).toContain('Hello <strong>Trigger</strong>')
    })

    test('Should render with expected html content', () => {
      expect($content.text()).toBe('Alright dave?')
      expect($content.html()).toBe('Alright <em>dave?</em>')
    })
  })

  describe('With html caller content', () => {
    beforeEach(() => {
      $details = renderTestComponent(
        'details',
        { summaryHtml: '<h2>Good evening sir</h2>' },
        `<p>Hello and <strong>Welcome</strong></p>`
      )('[data-testid="app-details"]').first()
      $summary = $details.find('summary')
      $content = $details.find('[data-testid="app-details-content"]')
    })

    test('Should render with expected html summary', () => {
      expect($summary.text()).toBe('Good evening sir')
      expect($summary.html()).toContain('<h2>Good evening sir</h2>')
    })

    test('Should render with expected html content', () => {
      expect($content.text()).toBe('Hello and Welcome')
      expect($content.html()).toContain(
        '<p>Hello and <strong>Welcome</strong></p>'
      )
    })
  })
})
