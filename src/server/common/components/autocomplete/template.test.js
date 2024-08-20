import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Autocomplete Component', () => {
  let $autocompleteFromGroup
  let $select

  beforeEach(() => {
    const $component = renderTestComponent('autocomplete', {
      label: {
        text: 'By'
      },
      hint: {
        text: 'Choose a user'
      },
      id: 'user',
      name: 'user',
      suggestions: [
        {
          text: 'RoboCop',
          value: 'RoboCop',
          helper: 'User Id: 12454878'
        },
        {
          text: 'Roger Rabbit',
          value: 'Roger Rabbit',
          helper: 'User Id: 556456465'
        },
        {
          text: 'Barbie',
          value: 'Barbie',
          helper: 'User Id: 67567576'
        }
      ]
    })

    $autocompleteFromGroup = $component(
      '[data-testid="app-autocomplete-group"]'
    ).first()

    $select = $autocompleteFromGroup.find(
      '[data-testid="app-progressive-input"]'
    )
  })

  test('Should render with expected label', () => {
    const $label = $autocompleteFromGroup.find(
      '[data-testid="app-autocomplete-label"]'
    )

    expect($label).toHaveLength(1)
    expect($label.text().trim()).toBe('By')
  })

  test('Should render with expected hint input', () => {
    const $hint = $autocompleteFromGroup.find(
      '[data-testid="app-autocomplete-hint"]'
    )

    expect($hint).toHaveLength(1)
    expect($hint.text().trim()).toBe('Choose a user')
  })

  test('Should render with expected select input', () => {
    expect($select).toHaveLength(1)
  })

  test('Should render with expected suggestions', () => {
    const $options = $select.children('option')

    expect($options).toHaveLength(3)
    expect($options.eq(0).text().trim()).toBe('RoboCop')
    expect($options.eq(1).text().trim()).toBe('Roger Rabbit')
    expect($options.eq(2).text().trim()).toBe('Barbie')
  })
})
