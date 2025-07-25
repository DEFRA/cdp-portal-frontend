import qs from 'qs'
import isNull from 'lodash/isNull.js'
import escapeRegExp from 'lodash/escapeRegExp.js'

import {
  publish,
  subscribe
} from '../../../../client/common/helpers/event-emitter.js'
import { buildSuggestions } from './helpers/build-suggestions.js'
import { clientNotification } from '../../../../client/common/helpers/client-notification.js'

const selectMessage = ' - - select - - '
const tickSvgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" class="app-tick-icon" width="48" height="48" viewBox="0 -960 960 960"><path d="m419-285 291-292-63-64-228 228-111-111-63 64 174 175Zm60.679 226q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z"/></svg>`.trim()

/**
 * @typedef {object} Suggestion
 * @property {string} value
 * @property {string} text
 * @property {string} [hint]
 * @property {boolean} [disabled]
 * @property {Record<string, string|number|boolean>} [attributes]
 */

/**
 * @classdesc Autocomplete
 * @class Autocomplete
 */
class Autocomplete {
  /**
   * @param {HTMLElement | null} $module
   * @param {object} options
   */
  constructor($module, options = {}) {
    if (!($module instanceof HTMLElement)) {
      return
    }

    this.options = options // For sending options via extended class
    this.$module = $module
    this.$select = this.$module.querySelector(
      `[data-js*="app-progressive-input"]`
    )
    this.name = this.$select.name

    this.enhanceSelectWithAutocomplete()

    this.$autocomplete = this.$module.querySelector(
      '[data-js*="app-autocomplete-input"]'
    )
    this.$form = this.$autocomplete.form
    this.$noJsSubmitButton = this.$autocomplete.form.querySelector(
      '[data-js="app-no-js-submit-button"]'
    )
    this.queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })
    this.$clearButton = $module.querySelector(
      '[data-js="app-autocomplete-clear-button"]'
    )
    this.$chevronButton = $module.querySelector(
      '[data-js="app-chevron-button"]'
    )
    this.$suggestionsContainer = $module.querySelector(
      '[data-js="app-autocomplete-suggestions"]'
    )
    /** @type {boolean} */
    this.isSuggestionsHidden = !this.$suggestionsContainer.classList.contains(
      'app-autocomplete__suggestions--show'
    )
    /** @type {number | null} */
    this.suggestionIndex = null
    this.suggestionsLength = this.getSuggestionsMarkup().length

    if (this.subscribeTo) {
      this.setupSubscription()
    }

    this.addEventListeners()
  }

  enhanceSelectWithAutocomplete() {
    const $select = this.$select
    const suggestionsContainerId = `app-autocomplete-${$select.id}-suggestions`
    const $autocomplete = document.createElement('input')

    this.suggestionClasses = $select.dataset.suggestionClasses
    this.subscribeTo = $select.dataset.subscribeTo
    this.publishTo = $select.dataset.publishTo

    this.noSuggestionsMessage = $select.dataset.noSuggestionsMessage
    this.removePasswordWidgets = $select.dataset.removePasswordWidgets
    this.placeholder = $select.dataset.placeholder
    this.typeahead = $select.dataset.typeahead

    const dataFetcherName = $select.dataset.fetcherName
    this.dataFetcher = {
      isEnabled: Boolean(dataFetcherName),
      name: dataFetcherName,
      $loader: document.querySelector(
        `[data-js*="${$select.dataset.fetcherLoader}"]`
      )
    }

    const siblingDataFetcherNames =
      $select.dataset.siblingDataFetcherNames?.split(',') ?? []
    const siblingDataFetcherTargets =
      $select.dataset.siblingDataFetcherTargets?.split(',') ?? []
    const siblingDataFetcherTargetLoaders =
      $select.dataset.siblingDataFetcherTargetLoaders?.split(',') ?? []

    this.siblingDataFetchers = siblingDataFetcherNames.map((name, index) => ({
      name,
      $target: document.querySelector(
        `[data-js*="${siblingDataFetcherTargets.at(index)}"]`
      ),
      $targetLoader: document.querySelector(
        `[data-js*="${siblingDataFetcherTargetLoaders.at(index)}"]`
      )
    }))

    const suggestion = this.getSuggestionByValue($select.value)

    $autocomplete.id = $select.id
    $autocomplete.type = 'text'
    $autocomplete.name = this.options.includeInput ? `${$select.name}Text` : ''
    $autocomplete.value = suggestion?.text ?? ''
    $autocomplete.classList.add('govuk-input', 'app-autocomplete__input')
    $autocomplete.placeholder = this.placeholder ?? selectMessage
    $autocomplete.dataset.js = $select.dataset.js.replace(
      'app-progressive-input',
      'app-autocomplete-input'
    )
    $autocomplete.dataset.testid = 'app-autocomplete-input'
    $autocomplete.setAttribute('autocapitalize', 'none')
    $autocomplete.setAttribute('autocomplete', 'off')
    $autocomplete.setAttribute('role', 'combobox')
    $autocomplete.setAttribute('aria-controls', suggestionsContainerId)
    $autocomplete.setAttribute('aria-autocomplete', 'list')
    $autocomplete.setAttribute('aria-expanded', 'false')

    if (this.removePasswordWidgets) {
      $autocomplete.setAttribute('data-1p-ignore', '') // Disable 1 password widget
      $autocomplete.setAttribute('data-lpignore', 'true') // Disable last password widget
    }

    // Autocomplete hidden input - this sends the value in the form
    const $autocompleteHiddenInput = document.createElement('input')
    $autocompleteHiddenInput.type = 'hidden'
    $autocompleteHiddenInput.name = $select.name
    $autocompleteHiddenInput.value = suggestion?.value ?? ''

    this.$autocompleteHiddenInput = $autocompleteHiddenInput

    $select.replaceWith($autocomplete, $autocompleteHiddenInput)
  }

  /**
   * Get raw suggestion that is not disabled, by value
   * @param {string|number} value
   * @returns Suggestion | undefined
   */
  getSuggestionByValue(value) {
    return window.cdp.suggestions?.[this.name].find(
      (suggestion) =>
        suggestion.disabled !== true &&
        suggestion.value?.toLowerCase() === value?.toLowerCase()
    )
  }

  /**
   * Get raw suggestion that is not disabled, by text
   * @param {string|number} textValue
   * @returns Suggestion | undefined
   */
  getSuggestionByText(textValue) {
    return window.cdp.suggestions?.[this.name].find(
      (suggestion) =>
        suggestion.disabled !== true &&
        suggestion.text?.toLowerCase() === textValue?.toLowerCase()
    )
  }

  /**
   * @param {string|number} textValue
   * @returns {HTMLLIElement}
   */
  getSuggestionMarkup(textValue) {
    return this.getSuggestionsMarkup().find(
      (suggestion) =>
        suggestion.dataset.text?.toLowerCase() === textValue?.toLowerCase()
    )
  }

  /**
   * @param {string|number} textValue
   * @returns {number}
   */
  getSuggestionIndex(textValue) {
    return this.getSuggestionsMarkup().findIndex(
      (suggestion) =>
        suggestion.dataset.text?.toLowerCase() === textValue?.toLowerCase()
    )
  }

  /** @returns {HTMLLIElement} */
  createSuggestionElementTemplate() {
    const $span = document.createElement('span')

    const $itemValue = $span.cloneNode(true)
    $itemValue.classList.add('app-suggestion__value')

    const $action = $span.cloneNode(true)
    $action.classList.add('app-suggestion__action')

    const $li = document.createElement('li')

    $li.classList.add('app-autocomplete__suggestion')
    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($action)

    return $li
  }

  /**
   * @param {Suggestion} item
   * @param {HTMLLIElement} $listElement
   * @param {number} index
   * @param {number} size
   * @param {string} name
   * @returns {HTMLLIElement|null}
   */
  buildSuggestion(item, $listElement, index, size, name) {
    if (item.disabled) {
      return null
    }

    const $li = $listElement.cloneNode(true)

    $li.id = `app-autocomplete-${name}-suggestion-${index}`
    $li.setAttribute('aria-posinset', index)
    $li.setAttribute('aria-setsize', size)

    return this.populateSuggestion($li, item)
  }

  /**
   * @param {HTMLLIElement} $li
   * @param {Suggestion} item
   * @returns {HTMLLIElement}
   */
  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value

    return $li
  }

  /** @returns {HTMLLIElement[]} */
  getSuggestionsMarkup() {
    const inputName = this.$select.name
    const suggestions = window.cdp.suggestions?.[this.name] ?? []
    const suggestionElement = this.createSuggestionElementTemplate()

    return suggestions
      .map((suggestion, i, suggestionsArray) =>
        this.buildSuggestion(
          suggestion,
          suggestionElement,
          i,
          suggestionsArray.length,
          inputName
        )
      )
      .filter(Boolean)
  }

  /**
   * Is Suggestions panel open
   * @returns {boolean}
   */
  isSuggestionsOpen() {
    return this.$suggestionsContainer?.getAttribute('aria-expanded') === 'true'
  }

  dispatchDocumentClickEvent() {
    return document.dispatchEvent(new Event('click', { bubbles: true }))
  }

  dispatchBlurEvent() {
    return this.$autocomplete.dispatchEvent(
      new Event('blur', { bubbles: true })
    )
  }

  dispatchInputEvent() {
    this.$autocomplete.dispatchEvent(new Event('input', { bubbles: true }))
  }

  submitForm() {
    this.$form.submit()
  }

  scrollToHighlight() {
    const $hasHighlight = this.$suggestionsContainer.querySelector(
      '[data-has-highlight="true"]'
    )

    if ($hasHighlight) {
      $hasHighlight.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    }
  }

  scrollToMatch() {
    const $match = this.$suggestionsContainer.querySelector(
      '[data-is-match="true"]'
    )

    if ($match) {
      $match.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    }
  }

  openSuggestions() {
    this.$suggestionsContainer.scrollTop = 0
    this.$suggestionsContainer.classList.add(
      'app-autocomplete__suggestions--show'
    )
    this.$suggestionsContainer.setAttribute('aria-expanded', 'true')

    this.$autocomplete.setAttribute('aria-expanded', 'true')

    this.$chevronButton.classList.add('app-autocomplete__chevron-button--open')
    this.$chevronButton.setAttribute('aria-label', 'Hide')

    this.scrollToMatch()
  }

  closeSuggestions() {
    this.$suggestionsContainer.scrollTop = 0
    this.$suggestionsContainer.classList.remove(
      'app-autocomplete__suggestions--show'
    )
    this.$suggestionsContainer.setAttribute('aria-expanded', 'false')

    this.$autocomplete.setAttribute('aria-expanded', 'false')

    this.$chevronButton.classList.remove(
      'app-autocomplete__chevron-button--open'
    )
    this.$chevronButton.setAttribute('aria-label', 'Show')
  }

  showCloseButton() {
    this.$clearButton.classList.add('app-autocomplete__clear-button--show')
    this.$clearButton.setAttribute('aria-hidden', 'false')
    this.$clearButton.setAttribute('aria-label', 'Clear')
  }

  hideCloseButton() {
    this.$clearButton.classList.remove('app-autocomplete__clear-button--show')
    this.$clearButton.setAttribute('aria-hidden', 'true')
    this.$clearButton.removeAttribute('aria-label')
  }

  filterPartialMatch(textValue) {
    return ($suggestion) =>
      $suggestion?.dataset?.text.toLowerCase().includes(textValue.toLowerCase())
  }

  filterExactMatch(textValue) {
    return ($suggestion) =>
      $suggestion?.dataset?.text.toLowerCase() === textValue.toLowerCase()
  }

  provideSuggestions({ textValue, suggestionIndex } = {}) {
    const match = this.getSuggestionMarkup(textValue)

    if (match?.value) {
      // Autocomplete input value exact matches a suggestion

      const filterExactMatch = this.filterExactMatch(textValue)
      return this.getSuggestionsMarkup()
        .filter(filterExactMatch)
        .map(this.dressSuggestion({ textValue, suggestionIndex }))
    } else if (textValue) {
      // Partial match

      const filterPartialMatch = this.filterPartialMatch(textValue)
      return this.getSuggestionsMarkup()
        .filter(filterPartialMatch)
        .map(this.dressSuggestion({ textValue, suggestionIndex }))
    } else {
      // Reset suggestions

      return this.getSuggestionsMarkup().map(
        this.dressSuggestion({ textValue, suggestionIndex })
      )
    }
  }

  populateSuggestions({ textValue, suggestionIndex } = {}) {
    const providedSuggestions = this.provideSuggestions({
      textValue,
      suggestionIndex
    })

    const $suggestions = providedSuggestions?.length
      ? providedSuggestions
      : [this.buildNoSuggestionsMessage(textValue)]

    this.$suggestionsContainer.replaceChildren(...$suggestions)
    this.suggestionsLength = $suggestions.length
    this.suggestionIndex = suggestionIndex

    const highlightIndex = (suggestionIndex ?? 0) + 1

    if (highlightIndex) {
      this.$autocomplete.setAttribute(
        'aria-activedescendant',
        `app-autocomplete-${this.$select.name}-suggestion-${highlightIndex}`
      )
    }

    if (suggestionIndex === null) {
      this.$autocomplete.removeAttribute('aria-activedescendant')
    }

    return $suggestions
  }

  dressSuggestion({ textValue, suggestionIndex } = {}) {
    return ($suggestion, index) => {
      this.manageTextHighlight($suggestion, textValue)
      this.manageChoiceHighlight($suggestion, index, suggestionIndex)
      this.manageMatch($suggestion, textValue)

      return $suggestion
    }
  }

  manageTextHighlight($suggestion, textValue = null) {
    if (textValue) {
      $suggestion.firstElementChild.innerHTML =
        $suggestion.dataset?.text.replace(
          new RegExp(escapeRegExp(textValue), 'gi'),
          `<strong>$&</strong>`
        )
    } else {
      $suggestion.firstElementChild.innerHTML = $suggestion.dataset?.text
    }

    return $suggestion
  }

  manageChoiceHighlight($suggestion, index, suggestionIndex = null) {
    const className = 'app-autocomplete__suggestion--highlight'

    if (!isNull(suggestionIndex) && suggestionIndex === index) {
      $suggestion.classList.add(className)
      $suggestion.setAttribute('aria-selected', true)
      $suggestion.dataset.hasHighlight = 'true'
    } else {
      $suggestion.classList.remove(className)
      $suggestion.setAttribute('aria-selected', false)
      $suggestion.dataset.hasHighlight = 'false'
    }

    return $suggestion
  }

  manageMatch($suggestion, textValue = null) {
    if (
      textValue &&
      textValue?.toLowerCase() === $suggestion.dataset?.text?.toLowerCase()
    ) {
      $suggestion.lastChild.innerHTML = tickSvgIcon
      $suggestion.dataset.isMatch = 'true'
      $suggestion.setAttribute('aria-selected', true)
    } else {
      $suggestion.lastChild.innerHTML = ''
      $suggestion.dataset.isMatch = 'false'
      $suggestion.setAttribute('aria-selected', false)
    }

    return $suggestion
  }

  /**
   * Display a message to the user in the suggestions box:
   * - When there are no matching results
   * - When suggestions have not been populated and need a prior action to populate suggestions in the autoComplete
   * @param {string} textValue
   * @returns {HTMLLIElement}
   */
  buildNoSuggestionsMessage(textValue) {
    const $li = document.createElement('li')

    const noSuggestionsMessage = this.noSuggestionsMessage
      ? ` - - ${this.noSuggestionsMessage} - - `
      : selectMessage
    const message = textValue ? ' - - no results - - ' : noSuggestionsMessage

    $li.classList.add(
      'app-autocomplete__suggestion',
      'app-autocomplete__suggestion--no-results'
    )
    $li.setAttribute('role', 'option')
    $li.dataset.interactive = 'false'
    $li.textContent = message

    return $li
  }

  setupSubscription() {
    subscribe(this.subscribeTo, this.resetAutocomplete.bind(this))
  }

  publishEvent(name, value) {
    publish(this.publishTo, { queryParams: { [name]: value } })
  }

  callDataFetcher(value) {
    const dataFetcherMethod = window.cdp[this.dataFetcher.name]
    const name = this.name

    if (typeof dataFetcherMethod !== 'function') {
      return
    }

    if (value?.length <= 1) {
      window.cdp.suggestions[name] = []
      return
    }

    const isLoadingClassName = 'app-loader--is-loading'
    const $loader = this.dataFetcher.$loader
    const delayedLoader = setTimeout(() => {
      $loader.classList.add(isLoadingClassName)
    }, 600) // Long delay so only shown on heavy loads

    return dataFetcherMethod(value)
      .then((fetchedSuggestions) => {
        const suggestionOptions = buildSuggestions(fetchedSuggestions)
        window.cdp.suggestions[name] = suggestionOptions

        this.populateSuggestions({
          textValue: this.$autocomplete.value,
          suggestionIndex: this.suggestionIndex
        })

        return suggestionOptions
      })
      .catch((error) => {
        clientNotification(error.message)
        return error
      })
      .finally(() => {
        clearTimeout(delayedLoader)
        $loader?.classList?.remove(isLoadingClassName)
      })
  }

  /**
   * Call all sibling data fetcher methods to fetch suggestions for a targeted sibling input in the same form
   * @param {string} inputValue - text input value
   * @returns {undefined|Suggestions|Error}
   */
  callSiblingDataFetchers(inputValue) {
    this.siblingDataFetchers.map((siblingDataFetcher) =>
      this.callSiblingFetcher(
        inputValue,
        siblingDataFetcher.name,
        siblingDataFetcher.$target?.id,
        siblingDataFetcher.$targetLoader
      )
    )
  }

  callSiblingFetcher(inputValue, name, targetId, $targetLoader) {
    const siblingDataFetcherMethod = window.cdp[name]

    if (!targetId || typeof siblingDataFetcherMethod !== 'function') {
      return
    }

    if (!inputValue) {
      window.cdp.suggestions[targetId] = []
      return
    }

    const isLoadingClassName = 'app-loader--is-loading'
    const delayedLoader = setTimeout(() => {
      $targetLoader.classList.add(isLoadingClassName)
    }, 200)

    return siblingDataFetcherMethod(inputValue)
      .then((fetchedSuggestions) => {
        const suggestionOptions = buildSuggestions(fetchedSuggestions)
        window.cdp.suggestions[targetId] = suggestionOptions

        return suggestionOptions
      })
      .catch((error) => {
        clientNotification(error.message)
        return error
      })
      .finally(() => {
        clearTimeout(delayedLoader)
        $targetLoader?.classList?.remove(isLoadingClassName)
      })
  }

  /**
   * @typedef {object} Input
   * @property {string|undefined} text - the visual text you see in the input
   * @property {string|undefined} value - the value set to the hidden input
   */

  /**
   * Set input text value and hidden input value. Both can be empty strings or undefined
   * Also dispatch publish event if setup and call fetcher if enabled
   * @param {Input} args
   */
  updateInputValue({ text, value, withPublish = true } = {}) {
    const inputText = text ?? ''
    const inputValue = value ?? ''

    this.$autocomplete.value = inputText
    this.$autocompleteHiddenInput.value = inputValue

    if (this.publishTo && withPublish) {
      this.publishEvent(this.$autocompleteHiddenInput.name, inputValue)
    }

    if (this.siblingDataFetchers?.length) {
      this.callSiblingDataFetchers(inputValue)
    }
  }

  resetAutocompleteValues() {
    this.updateInputValue({ text: '', value: '' })
  }

  resetAutocomplete() {
    this.resetAutocompleteValues()
    this.hideCloseButton()

    this.getSuggestionsMarkup()
    this.populateSuggestions({
      textValue: this.$autocomplete.value,
      suggestionIndex: this.suggestionIndex
    })
  }

  choiceAction() {
    this.dispatchInputEvent()
  }

  autocompleteInputEvent(event) {
    if (this.isSuggestionsHidden) {
      this.openSuggestions()
    }

    const textValue = event?.target?.value

    if (textValue) {
      this.showCloseButton()
    } else {
      this.hideCloseButton()
      this.$suggestionsContainer.scrollTop = 0 // Move suggestions window scroll bar to top
      this.suggestionIndex = null // Typing in input, no current highlight of suggestion, reset selection index
    }

    if (this.dataFetcher.isEnabled) {
      this.callDataFetcher(textValue)
    }

    this.populateSuggestions({
      textValue,
      suggestionIndex: this.suggestionIndex
    })

    const foundSuggestion = this.getSuggestionByText(textValue)

    // An exact match was found
    if (foundSuggestion?.value) {
      this.updateInputValue({
        text: textValue,
        value: foundSuggestion.value
      })
      return
    }

    // Only send request to search on typing if component is a typeahead. Always clear if value is empty
    if (this.typeahead ?? !textValue) {
      this.updateInputValue({ text: textValue, value: textValue })
    }
  }

  clearButtonClickEvent() {
    this.resetAutocompleteValues()
    this.$autocomplete.focus()

    this.dispatchInputEvent()
    this.hideCloseButton()
    this.populateSuggestions({
      textValue: this.$autocomplete.value,
      suggestionIndex: null
    })
  }

  addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const initializeAutocomplete = async () => {
        if (this.$noJsSubmitButton) {
          this.$noJsSubmitButton.remove()
        }

        const queryParamValue =
          this.queryParams?.[this.$autocompleteHiddenInput.name]

        if (queryParamValue) {
          if (this.dataFetcher.isEnabled) {
            await this.callDataFetcher(queryParamValue)
          }

          const suggestion = this.getSuggestionByValue(queryParamValue)

          const text = suggestion?.text ?? queryParamValue
          const value = suggestion?.value ?? queryParamValue
          this.updateInputValue({ text, value, withPublish: false })

          this.showCloseButton()
        }

        if (this.$autocomplete.value) {
          this.showCloseButton()
          const matchIndex = this.getSuggestionIndex(this.$autocomplete.value)

          this.populateSuggestions({
            textValue: this.$autocomplete.value,
            suggestionIndex: matchIndex > -1 ? matchIndex : null
          })
        }
      }

      initializeAutocomplete().catch(clientNotification)
    })

    this.$clearButton.addEventListener(
      'click',
      this.clearButtonClickEvent.bind(this)
    )

    this.$chevronButton.addEventListener('click', (event) => {
      event.stopPropagation()

      this.populateSuggestions({
        textValue: this.$autocomplete.value,
        suggestionIndex: this.suggestionIndex
      })

      if (this.isSuggestionsOpen()) {
        this.closeSuggestions()
      } else {
        this.openSuggestions()
      }
    })

    // Click outside Dropdown component
    document.addEventListener('click', (event) => {
      if (event.target !== this.$autocomplete && this.isSuggestionsOpen()) {
        this.closeSuggestions()
        this.populateSuggestions({ suggestionIndex: null })
      }
    })

    // User focus into the input
    this.$autocomplete.addEventListener('focus', (event) => {
      const textValue = event?.target?.value

      this.populateSuggestions({
        textValue,
        suggestionIndex: null
      })
      this.openSuggestions()
    })

    // Mouse clicks into the input
    this.$autocomplete.addEventListener('click', (event) => {
      this.dispatchDocumentClickEvent()

      event.stopPropagation()

      const textValue = event?.target?.value

      if (textValue) {
        this.showCloseButton()
      } else {
        this.hideCloseButton()
      }

      this.populateSuggestions({
        textValue,
        suggestionIndex: null
      })
      this.openSuggestions()
    })

    // User typing inside input
    this.$autocomplete.addEventListener(
      'input',
      this.autocompleteInputEvent.bind(this)
    )

    // Mainly keyboard navigational events
    this.$autocomplete.addEventListener('keydown', (event) => {
      const code = event.code.toLowerCase()
      const textValue = event.target.value

      if ((code === 'backspace' && !textValue) || code === 'escape') {
        this.closeSuggestions()
        this.populateSuggestions({
          textValue,
          suggestionIndex: null
        })
      }

      // Tab rather than blur is used to hide suggestions, as blur fires when clicking suggestion in suggestions container
      if (code === 'tab') {
        this.closeSuggestions()
        this.dispatchBlurEvent()

        if (textValue && this.suggestionIndex === null) {
          // Auto match a value for a user who has typed in the input and blurred without selection
          const matchIndex = this.getSuggestionIndex(textValue)

          this.populateSuggestions({
            textValue,
            suggestionIndex: matchIndex > -1 ? matchIndex : null
          })
        }
      }

      if (code === 'arrowup') {
        if (isNull(this.suggestionIndex)) {
          this.suggestionIndex = this.suggestionsLength - 1
        } else {
          this.suggestionIndex--
        }

        // When the first suggestion is passed scroll to the end of the suggestions list
        if (this.suggestionIndex < 0) {
          this.suggestionIndex = this.suggestionsLength - 1
        }
      }

      if (code === 'arrowdown') {
        if (isNull(this.suggestionIndex)) {
          this.suggestionIndex = 0
        } else {
          this.suggestionIndex++
        }

        // When last suggestion is passed scroll to the start of the suggestion list
        if (this.suggestionIndex > this.suggestionsLength - 1) {
          this.suggestionIndex = 0
        }

        // If suggestion closed, open suggestion on down arrow press
        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }
      }

      if (['arrowup', 'arrowdown'].includes(code)) {
        // This is managing the highlight in the suggestions panel
        const $filteredSuggestions = this.populateSuggestions({
          textValue,
          suggestionIndex: this.suggestionIndex
        })

        const $currentSuggestion = $filteredSuggestions.at(
          this.suggestionIndex ?? 0
        )

        // Manage scrolling in the suggestions container
        if ($currentSuggestion) {
          const { height: suggestionsContainerHeight } =
            this.$suggestionsContainer.getBoundingClientRect()
          const { height: suggestionHeight } =
            $currentSuggestion.getBoundingClientRect()

          const suggestionsContainerScrollTop =
            this.$suggestionsContainer.scrollTop
          const suggestionsContainerScrollBottom =
            this.$suggestionsContainer.scrollTop + suggestionsContainerHeight
          const currentSuggestionTop = $currentSuggestion.offsetTop
          const currentSuggestionBottom =
            $currentSuggestion.offsetTop + suggestionHeight

          if (code === 'arrowdown') {
            if (currentSuggestionBottom >= suggestionsContainerScrollBottom) {
              this.$suggestionsContainer.scroll(
                0,
                currentSuggestionBottom - suggestionsContainerHeight
              )
            }
            if (currentSuggestionBottom <= suggestionsContainerHeight) {
              this.$suggestionsContainer.scroll(0, 0)
            }
          }

          if (code === 'arrowup') {
            if (currentSuggestionTop <= suggestionsContainerScrollTop) {
              this.$suggestionsContainer.scroll(0, currentSuggestionTop)
            }
            if (
              currentSuggestionTop >=
              this.$suggestionsContainer.scrollHeight -
                suggestionsContainerHeight
            ) {
              this.$suggestionsContainer.scroll(0, currentSuggestionTop)
            }
          }
        }
      }

      if (code === 'home') {
        event.preventDefault()

        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }

        // Set highlight to first suggestion in suggestions panel
        this.populateSuggestions({
          textValue,
          suggestionIndex: 0
        })

        this.scrollToHighlight()
      }

      if (code === 'end') {
        event.preventDefault()

        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }

        // Set highlight to last suggestion in suggestions panel
        this.populateSuggestions({
          textValue,
          suggestionIndex: this.suggestionsLength - 1
        })

        this.scrollToHighlight()
      }

      if (code === 'enter') {
        if (this.isSuggestionsOpen()) {
          // If enter is pressed while suggestions are open do not submit form
          event.preventDefault()
        } else {
          if (!this.$autocomplete.value) {
            // If input has no value open suggestions
            event.preventDefault()
            this.openSuggestions()
          }
          // Otherwise fall through to default "enter pressed in input" form functionality, which will submit the form
        }

        if (!isNull(this.suggestionIndex)) {
          // User has used arrow keys to highlight a suggestion in the suggestions panel. And then pressed enter
          const $filteredSuggestions = this.populateSuggestions({
            textValue,
            suggestionIndex: this.suggestionIndex
          })
          const $currentSuggestion = $filteredSuggestions?.at(
            this.suggestionIndex
          )

          this.updateInputValue({
            text: $currentSuggestion.dataset?.text,
            value: $currentSuggestion.dataset?.value
          })

          this.choiceAction()
          this.suggestionIndex = null
        }

        if (this.$autocomplete.value) {
          this.closeSuggestions()
          this.showCloseButton()
        } else {
          this.openSuggestions()
          this.hideCloseButton()
        }
      }
    })

    this.$suggestionsContainer.addEventListener('click', (event) => {
      event.stopPropagation()

      const $suggestion = event?.target?.closest(
        '.app-autocomplete__suggestion'
      )

      if ($suggestion && $suggestion.dataset.interactive !== 'false') {
        this.updateInputValue({
          text: $suggestion?.dataset?.text,
          value: $suggestion?.dataset?.value
        })

        this.choiceAction()

        this.suggestionIndex = $suggestion.getAttribute('aria-posinset') - 1

        this.populateSuggestions({
          textValue: $suggestion?.dataset?.text,
          suggestionIndex: this.suggestionIndex
        })

        this.closeSuggestions()
        this.showCloseButton()
      }
    })
  }
}

export { Autocomplete }
