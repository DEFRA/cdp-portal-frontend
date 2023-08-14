import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Search Component', () => {
  let $searchFormGroup

  beforeEach(() => {
    const $component = renderTestComponent('search', {
      label: {
        text: 'Search me'
      },
      hint: {
        text: 'Search for deployments by name'
      },
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

    $searchFormGroup = $component('[data-testid="app-search-group"]').first()
  })

  test('Should render with expected label', () => {
    const $label = $searchFormGroup.find('[data-testid="app-search-label"]')

    expect($label.length).toEqual(1)
    expect($label.text().trim()).toEqual('Search me')
  })

  test('Should render with expected hint input', () => {
    const $hint = $searchFormGroup.find('[data-testid="app-search-hint"]')

    expect($hint.length).toEqual(1)
    expect($hint.text().trim()).toEqual('Search for deployments by name')
  })

  test('Should render with expected search input', () => {
    expect(
      $searchFormGroup.find('[data-testid="app-search-input"]').length
    ).toEqual(1)
  })
})
