import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Search Component', () => {
  let $search

  beforeEach(() => {
    const $component = renderTestComponent('search', {
      label: 'Search me',
      id: 'search',
      name: 'q',
      suggestions: [
        {
          label: 'cdp-portal-frontend',
          value: 'cdp-portal-frontend'
        },
        {
          label: 'cdp-self-service-ops',
          value: 'cdp-self-service-ops'
        }
      ]
    })

    $search = $component('[data-testid="app-search"]').first()
  })

  test('Should render with expected search input', () => {
    expect($search.find(`[data-testid="app-search-input"]`).length).toEqual(1)
  })

  test('Should render with expected button', () => {
    expect(
      $search.find(`[data-testid="app-search-submit-button"]`).length
    ).toEqual(1)
  })
})
