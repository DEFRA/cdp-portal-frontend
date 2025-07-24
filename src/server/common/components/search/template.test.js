import { beforeEach, describe, expect, test } from 'vitest'
import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

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
      name: 'q'
    })

    $searchFormGroup = $component('[data-testid="app-search-group"]').first()
  })

  test('Should render with expected label', () => {
    const $label = $searchFormGroup.find('[data-testid="app-search-label"]')

    expect($label).toHaveLength(1)
    expect($label.text().trim()).toBe('Search me')
  })

  test('Should render with expected hint input', () => {
    const $hint = $searchFormGroup.find('[data-testid="app-search-hint"]')

    expect($hint).toHaveLength(1)
    expect($hint.text().trim()).toBe('Search for deployments by name')
  })

  test('Should render with expected search input', () => {
    expect(
      $searchFormGroup.find('[data-testid="app-search-input"]')
    ).toHaveLength(1)
  })
})
