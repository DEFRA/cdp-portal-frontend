import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

const renderAutoComplete = (params = {}) => {
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
    ],
    ...params
  })

  const $autocompleteFromGroup = $component(
    '[data-testid="app-autocomplete-group"]'
  ).first()

  const $input = $autocompleteFromGroup.find(
    '[data-testid="app-progressive-input"]'
  )

  const $autocomplete = $autocompleteFromGroup.find(
    '[data-testid="app-autocomplete"]'
  )

  return {
    $component,
    $autocompleteFromGroup,
    $input,
    $autocomplete
  }
}

describe('Autocomplete Component', () => {
  let $autocomplete
  let $autocompleteFromGroup
  let $input

  describe('When rendering with default props', () => {
    beforeEach(() => {
      ;({ $autocompleteFromGroup, $autocomplete, $input } =
        renderAutoComplete())
    })

    test('Should render with expected select input', () => {
      expect($input).toHaveLength(1)
    })

    test('Autocomplete should render', () => {
      expect($autocomplete).toHaveLength(1)
    })

    test('Should render expected element type', () => {
      expect($input.get(0).tagName).toBe('select')
    })

    test('Should render with expected classes', () => {
      expect($input.attr('class')).toBe('govuk-select app-select')
    })

    test('Should render with expected attributes', () => {
      expect($input.attr('name')).toBe('user')
      expect($input.attr('id')).toBe('user')
      expect($input.data('js')).toBe('app-progressive-input')
      expect($input.data('remove-password-widgets')).toBe(true)
      expect($input.data('testid')).toBe('app-progressive-input')
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

    test('Should render with expected suggestions', () => {
      const $options = $input.children('option')

      expect($options).toHaveLength(3)
      expect($options.eq(0).text().trim()).toBe('RoboCop')
      expect($options.eq(1).text().trim()).toBe('Roger Rabbit')
      expect($options.eq(2).text().trim()).toBe('Barbie')
    })

    test('Autocomplete should render with expected data attributes', () => {
      expect($autocomplete.data('js')).toBe('app-autocomplete')
    })

    test('Autocomplete should render with expected class', () => {
      expect($autocomplete.hasClass('app-autocomplete--search')).toBe(false)
    })
  })

  describe('When rendering with template prop', () => {
    beforeEach(() => {
      ;({ $autocomplete, $input } = renderAutoComplete({
        template: 'search'
      }))
    })

    test('Should render with expected input', () => {
      expect($input).toHaveLength(1)
    })

    test('Autocomplete should render', () => {
      expect($autocomplete).toHaveLength(1)
    })

    test('Should render expected element type', () => {
      expect($input.get(0).tagName).toBe('input')
      expect($input.attr('type')).toBe('text')
    })

    test('Should render with expected classes', () => {
      expect($input.attr('class')).toBe('govuk-input app-input')
    })

    test('Should render with expected attributes', () => {
      expect($input.attr('name')).toBe('user')
      expect($input.attr('id')).toBe('user')
      expect($input.data('js')).toBe('app-progressive-input')
      expect($input.data('remove-password-widgets')).toBe(true)
      expect($input.data('testid')).toBe('app-progressive-input')
    })

    test('Autocomplete should render with expected data attributes', () => {
      expect($autocomplete.data('js')).toBe('app-autocomplete-search')
    })

    test('Autocomplete should render with expected class', () => {
      expect($autocomplete.hasClass('app-autocomplete--search')).toBe(true)
    })
  })

  describe('When rendering with optional params', () => {
    const noResults = 'no results'
    const placeHolder = 'type here'
    const dataFetcher = {
      name: 'fetchMock',
      loader: 'mock-loader'
    }
    const siblingDataFetcher = {
      names: ['fetchVersions'],
      targets: ['deploy-version'],
      targetLoaders: ['deploy-version-loader']
    }
    const publishTo = 'autocompleteUpdate-version'
    const suggestionClasses = 'app-autocomplete__suggestion--custom'

    beforeEach(() => {
      ;({ $autocomplete, $input } = renderAutoComplete({
        noSuggestionsMessage: noResults,
        removePasswordWidgets: true,
        placeholder: placeHolder,
        typeahead: true,
        dataFetcher,
        siblingDataFetcher,
        publishTo,
        suggestionClasses
      }))
    })

    test('Should render with expected no suggestions message attribute', () => {
      expect($input.data('no-suggestions-message')).toBe(noResults)
    })

    test('Should render with expected remove password widgets attribute', () => {
      expect($input.data('remove-password-widgets')).toBe(true)
    })

    test('Should render with expected placeholder attribute', () => {
      expect($input.data('placeholder')).toBe(placeHolder)
    })

    test('Should render with expected typeahead attribute', () => {
      expect($input.data('typeahead')).toBe(true)
    })

    test('Should render with expected data fetcher attributes', () => {
      expect($input.data('fetcher-name')).toBe(dataFetcher.name)
      expect($input.data('fetcher-loader')).toBe(dataFetcher.loader)
    })

    test('Should render with expected data sibling fetcher attributes', () => {
      expect($input.data('sibling-data-fetcher-names')).toBe(
        siblingDataFetcher.names.at(0)
      )
      expect($input.data('sibling-data-fetcher-targets')).toBe(
        siblingDataFetcher.targets.at(0)
      )
      expect($input.data('sibling-data-fetcher-target-loaders')).toBe(
        siblingDataFetcher.targetLoaders.at(0)
      )
    })

    test('Should render with expected publish to pub-sub attribute', () => {
      expect($input.data('publish-to')).toBe(publishTo)
    })

    test('Should render with expected suggestionClasses attribute', () => {
      expect($input.data('suggestion-classes')).toBe(suggestionClasses)
    })
  })

  describe('When rendering with loader', () => {
    beforeEach(() => {
      ;({ $autocompleteFromGroup } = renderAutoComplete({
        loader: {
          name: 'mock-loader'
        }
      }))
    })

    test('Should render with expected loader', () => {
      const $loader = $autocompleteFromGroup.find('[data-testid="app-loader"]')

      expect($loader).toHaveLength(1)
      expect($loader.attr('class')).toBe('app-loader')
      expect($loader.data('js')).toBe('mock-loader')
    })
  })

  describe('When rendering with icon', () => {
    beforeEach(() => {
      ;({ $autocompleteFromGroup, $autocomplete } = renderAutoComplete({
        icon: '<svg data-testid="app-icon">Mock icon</svg>'
      }))
    })

    test('Autocomplete should render with expected class', () => {
      expect($autocomplete.hasClass('app-autocomplete--with-icon')).toBe(true)
    })

    test('Should render with expected icon', () => {
      const $inputIcon = $autocompleteFromGroup.find('[data-testid="app-icon"]')

      expect($inputIcon).toHaveLength(1)
    })
  })
})
