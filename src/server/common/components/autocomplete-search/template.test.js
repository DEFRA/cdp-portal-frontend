import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Autocomplete Search Component', () => {
  let $autocompleteSearchFormGroup

  beforeEach(() => {
    const $component = renderTestComponent('autocomplete-search', {
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

    $autocompleteSearchFormGroup = $component(
      '[data-testid="app-autocomplete-search-group"]'
    ).first()
  })

  test('Should render with expected label', () => {
    const $label = $autocompleteSearchFormGroup.find(
      '[data-testid="app-autocomplete-search-label"]'
    )

    expect($label.length).toEqual(1)
    expect($label.text().trim()).toEqual('Search me')
  })

  test('Should render with expected hint input', () => {
    const $hint = $autocompleteSearchFormGroup.find(
      '[data-testid="app-autocomplete-search-hint"]'
    )

    expect($hint.length).toEqual(1)
    expect($hint.text().trim()).toEqual('Search for deployments by name')
  })

  test('Should render with expected search input', () => {
    expect(
      $autocompleteSearchFormGroup.find(
        '[data-testid="app-autocomplete-search-input"]'
      ).length
    ).toEqual(1)
  })
})
