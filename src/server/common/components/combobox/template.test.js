import { renderTestComponent } from '#test-helpers/component-helpers.js'

const renderAutoComplete = (params = {}) => {
  const $component = renderTestComponent('combobox', {
    params: {
      label: {
        text: 'By'
      },
      hint: {
        text: 'Choose a user'
      },
      id: 'user',
      name: 'user',
      options: [
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
      ],
      ...params
    }
  })

  const $comboboxFromGroup = $component(
    '[data-testid="app-autocomplete-group"]'
  ).first()

  const $input = $comboboxFromGroup.find(
    '[data-testid="app-progressive-input"]'
  )

  const $combobox = $comboboxFromGroup.find('[data-testid="app-autocomplete"]')

  return {
    $component,
    $comboboxFromGroup,
    $input,
    $combobox
  }
}

describe('Combobox Component', () => {
  let $combobox
  let $comboboxFromGroup
  let $input

  describe('When rendering with default props', () => {
    beforeEach(() => {
      ;({ $comboboxFromGroup, $combobox, $input } = renderAutoComplete())
    })

    test('Should render with expected select input', () => {
      expect($input).toHaveLength(1)
    })

    test('Autocomplete should render', () => {
      expect($combobox).toHaveLength(1)
    })

    test('Should render expected element type', () => {
      expect($input.get(0).tagName).toBe('select')
    })

    test('Should render with expected classes', () => {
      expect($input.attr('class')).toBe('govuk-select app-select js-hidden')
    })

    test('Should render with expected attributes', () => {
      expect($input.attr('id')).toBe('user')
      expect($input.data('testid')).toBe('app-progressive-input')
    })

    test('Should render with expected label', () => {
      const $label = $comboboxFromGroup.find(
        '[data-testid="app-autocomplete-label"]'
      )

      expect($label).toHaveLength(1)
      expect($label.text().trim()).toBe('By')
    })

    test('Should render with expected hint input', () => {
      const $hint = $comboboxFromGroup.find(
        '[data-testid="app-autocomplete-hint"]'
      )

      expect($hint).toHaveLength(1)
      expect($hint.text().trim()).toBe('Choose a user')
    })

    test('Should render with expected suggestions', () => {
      const $options = $input.children('option')

      expect($options).toHaveLength(4)
      expect($options.eq(0).text().trim()).toBe('- - select - -')
      expect($options.eq(1).text().trim()).toBe('RoboCop')
      expect($options.eq(2).text().trim()).toBe('Roger Rabbit')
      expect($options.eq(3).text().trim()).toBe('Barbie')
    })

    test('Autocomplete should render with expected class', () => {
      expect($combobox.hasClass('app-autocomplete--search')).toBe(false)
    })
  })

  describe('When rendering with loader', () => {
    beforeEach(() => {
      ;({ $comboboxFromGroup } = renderAutoComplete({
        loader: {
          name: 'mock-loader'
        }
      }))
    })

    test('Should render with expected loader', () => {
      const $loader = $comboboxFromGroup.find('[data-testid="app-loader"]')

      expect($loader).toHaveLength(1)
      expect($loader.attr('class')).toBe('app-loader')
      expect($loader.data('js')).toBe('mock-loader')
    })
  })

  describe('When rendering with icon', () => {
    beforeEach(() => {
      ;({ $comboboxFromGroup, $combobox } = renderAutoComplete({
        icon: '<svg data-testid="app-icon">Mock icon</svg>'
      }))
    })

    test('Autocomplete should render with expected class', () => {
      expect($combobox.hasClass('app-combobox--with-icon')).toBe(true)
    })

    test('Should render with expected icon', () => {
      const $inputIcon = $comboboxFromGroup.find('[data-testid="app-icon"]')

      expect($inputIcon).toHaveLength(1)
    })
  })
})
