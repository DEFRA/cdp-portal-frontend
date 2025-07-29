import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { filters } from './filters.js'
import { clearFilters } from '../../../../client/common/helpers/fetch/filters/clear-filters.js'

const mockHistoryPush = vi.fn()
const mockHistoryReplace = vi.fn()

vi.mock('history', () => ({
  createBrowserHistory: () => ({
    push: (url) => mockHistoryPush(url),
    replace: (url, options) => mockHistoryReplace(url, options)
  })
}))

function setupFilters(params = {}) {
  const $filtersComponent = renderTestComponent('filters', {
    params,
    callBlock: [
      `<input type="text" name="plant-name" data-testid="plant-name" value="" placeholder="Search for a plants name"/>`
    ]
  })

  // Append component document
  document.body.innerHTML = $filtersComponent.html()

  // Mimic initialisation of filters
  const $filters = Array.from(
    document.querySelectorAll('[data-js="app-filters"]')
  )
  // Init ClientSide JavaScript
  if ($filters.length) {
    $filters.forEach(filters)
  }

  return {
    $form: document.querySelector('[data-testid="app-filters-form"]'),
    $legend: document.querySelector('[data-testid="app-filters-legend"]'),
    $caption: document.querySelector('[data-testid="app-filters-caption"]'),
    $info: document.querySelector('[data-testid="app-filters-info"]'),
    $textInput: document.querySelector('[data-testid="plant-name"]'),
    $hiddenInput: document.querySelector(
      '[data-testid="app-filters-hidden-input-owner"]'
    ),
    $filtersClearAll: document.querySelector(
      '[data-testid="app-filters-clear-all"]'
    )
  }
}

describe('#filters', () => {
  const options = {
    action: '/deployments/search',
    noJsButton: {
      text: 'Search'
    },
    legend: {
      text: 'Search'
    },
    caption: {
      text: 'Search and filter deployments'
    },
    info: {
      html: `<p>Use the search box to find plants by name</p>`
    },
    clear: {
      url: '/deployments'
    },
    hiddenInputs: {
      owner: 'scoobie'
    }
  }

  let $form,
    $legend,
    $caption,
    $info,
    $textInput,
    $hiddenInput,
    $filtersClearAll

  beforeEach(() => {
    window.cdp = window.cdp || {}
    window.cdp.clearFilters = clearFilters
    vi.useFakeTimers()
    ;({
      $form,
      $legend,
      $caption,
      $info,
      $textInput,
      $hiddenInput,
      $filtersClearAll
    } = setupFilters(options))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should have expected form', () => {
    expect($form).not.toBeNull()
    expect($form).toHaveAttribute('action', options.action)
    expect($form).toHaveAttribute('method', 'get')
  })

  test('Should have expected legend', () => {
    expect($legend).toBeInTheDocument()
    expect($legend).toHaveTextContent(options.legend.text)
  })

  test('Should have expected caption', () => {
    expect($caption).toBeInTheDocument()
    expect($caption).toHaveTextContent(options.caption.text)
  })

  test('Should have expected info', () => {
    expect($info).toBeInTheDocument()
    expect($info).toHaveTextContent('Use the search box to find plants by name')
  })

  test('Should have expected form inputs', () => {
    expect($textInput).toBeInTheDocument()
    expect($textInput).toHaveAttribute(
      'placeholder',
      'Search for a plants name'
    )

    expect($hiddenInput).toBeInTheDocument()
    expect($hiddenInput).toHaveValue(options.hiddenInputs.owner)
  })

  test('Should have clear all link', () => {
    expect($filtersClearAll).toBeInTheDocument()
    expect($filtersClearAll).toHaveAttribute('href', options.clear.url)
    expect($filtersClearAll).toHaveTextContent('Clear all')
  })

  test('When typing, should ajax submit form with expected query params', () => {
    $textInput.focus()
    $textInput.value = 'frangipani'

    $form.dispatchEvent(new Event('input'))

    // advance to past form debounce
    vi.advanceTimersByTime(220)

    expect(mockHistoryPush).toHaveBeenCalledWith(
      '?plant-name=frangipani&owner=scoobie'
    )
  })

  test('Clear all should work as expected', () => {
    expect(window.location.search).toEqual('')

    $textInput.focus()
    $textInput.value = 'Ribes rubrum'

    $form.dispatchEvent(new Event('input'))

    // advance to past form debounce
    vi.advanceTimersByTime(220)

    expect(mockHistoryPush).toHaveBeenCalledWith(
      '?plant-name=Ribes%20rubrum&owner=scoobie'
    )

    $filtersClearAll.click()

    expect(window.location.search).toEqual('')
  })
})
