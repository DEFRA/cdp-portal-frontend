import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Autocomplete Dropdown Component', () => {
  let $autocompleteDropdownFromGroup
  let $select

  beforeEach(() => {
    const $component = renderTestComponent('autocomplete-dropdown', {
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
          value: 'RoboCop'
        },
        {
          text: 'Roger Rabbit',
          value: 'Roger Rabbit'
        },
        {
          text: 'Barbie',
          value: 'Barbie'
        }
      ]
    })

    $autocompleteDropdownFromGroup = $component(
      '[data-testid="app-autocomplete-dropdown-group"]'
    ).first()

    $select = $autocompleteDropdownFromGroup.find(
      '[data-testid="app-autocomplete-dropdown-select"]'
    )
  })

  test('Should render with expected label', () => {
    const $label = $autocompleteDropdownFromGroup.find(
      '[data-testid="app-autocomplete-dropdown-label"]'
    )

    expect($label.length).toEqual(1)
    expect($label.text().trim()).toEqual('By')
  })

  test('Should render with expected hint input', () => {
    const $hint = $autocompleteDropdownFromGroup.find(
      '[data-testid="app-autocomplete-dropdown-hint"]'
    )

    expect($hint.length).toEqual(1)
    expect($hint.text().trim()).toEqual('Choose a user')
  })

  test('Should render with expected select input', () => {
    expect($select.length).toEqual(1)
  })

  test('Should render with expected suggestions', () => {
    const $options = $select.children('option')

    expect($options.length).toEqual(3)
    expect($options.eq(0).text().trim()).toEqual('RoboCop')
    expect($options.eq(1).text().trim()).toEqual('Roger Rabbit')
    expect($options.eq(2).text().trim()).toEqual('Barbie')
  })
})
