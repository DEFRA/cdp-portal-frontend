import qs from 'qs'
import isNull from 'lodash/isNull.js'
import escapeRegExp from 'lodash/escapeRegExp.js'

import { publish, subscribe } from '#client/common/helpers/event-emitter.js'
import { clientNotification } from '#client/common/helpers/client-notification.js'
import { tickSvgIcon } from '#client/common/icons/icons.js'

const selectMessage = ' - - select - - '
const $tickIcon = tickSvgIcon('app-icon app-icon--tiny')

/**
 * @typedef {object} Suggestion
 * @property {string} value
 * @property {string} text
 * @property {string} [hint]
 * @property {boolean} [disabled]
 * @property {Record<string, string|number|boolean>} [attributes]
 * @property {Record<string, string|string[]>} [queryParams]
 */

/**
 * @classdesc Combobox
 * @class Combobox
 */
export class Combobox {
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
    this.allowReselection = this.$select.dataset.allowReselection === 'true'
    this.name = this.$select.name
    this.$hiddenInputs = []

    this.enhanceSelectWithCombobox()

    this.$combobox = this.$module.querySelector(
      '[data-js*="app-combobox-input"]'
    )
    this.$form = this.$combobox.form
    this.$noJsSubmitButton = this.$combobox.form.querySelector(
      '[data-js="app-no-js-submit-button"]'
    )
    this.queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })
    this.$clearButton = $module.querySelector(
      '[data-js="app-combobox-clear-button"]'
    )
    this.$chevronButton = $module.querySelector(
      '[data-js="app-chevron-button"]'
    )
    this.$suggestionsContainer = $module.querySelector(
      '[data-js="app-combobox-suggestions"]'
    )
    /** @type {boolean} */
    this.isSuggestionsHidden = !this.$suggestionsContainer.classList.contains(
      'app-combobox__suggestions--show'
    )
    /** @type {number | null} */
    this.suggestionIndex = null
    this.suggestionsLength = this.getSuggestionsMarkup().length

    const suggestion = this.getSuggestionByValue(this.$select.value)

    this.setHiddenInputs(
      suggestion?.queryParams ?? {
        [this.$select.name]: suggestion?.value ?? this.$select.value ?? ''
      }
    )

    if (this.subscribeTo) {
      this.setupSubscription()
    }

    this.addEventListeners()
  }

  enhanceSelectWithCombobox() {
    const $select = this.$select
    const suggestionsContainerId = `app-combobox-${$select.id}-suggestions`
    const $combobox = document.createElement('input')

    this.suggestionClasses = $select.dataset.suggestionClasses
    this.subscribeTo = $select.dataset.subscribeTo
    this.publishTo = $select.dataset.publishTo

    this.noSuggestionsMessage = $select.dataset.noSuggestionsMessage
    this.removePasswordWidgets = $select.dataset.removePasswordWidgets
    this.placeholder = $select.dataset.placeholder
    this.typeahead = $select.dataset.typeahead

    const suggestion = this.getSuggestionByValue($select.value)

    $combobox.id = $select.id
    $combobox.type = 'text'
    $combobox.name = this.options.includeInput ? `${$select.name}Text` : ''
    $combobox.value = suggestion?.text ?? ''
    $combobox.classList.add('govuk-input', 'app-combobox__input')
    $combobox.placeholder = this.placeholder ?? selectMessage
    $combobox.dataset.js = $select.dataset.js.replace(
      'app-progressive-input',
      'app-combobox-input'
    )
    $combobox.dataset.testid = 'app-combobox-input'
    $combobox.dataset.typeahead = this.typeahead

    if (this.$select.dataset.hxPost) {
      $combobox.dataset.hxPost = this.$select.dataset.hxPost
      $combobox.dataset.hxTarget = this.$select.dataset.hxTarget
      $combobox.dataset.hxSelect = this.$select.dataset.hxTarget
      $combobox.dataset.hxTrigger = 'change'

      if (this.$select.dataset.hxIndicator) {
        $combobox.dataset.hxIndicator = this.$select.dataset.hxIndicator
      }
    }

    $combobox.setAttribute('autocapitalize', 'none')
    $combobox.setAttribute('combobox', 'off')
    $combobox.setAttribute('role', 'combobox')
    $combobox.setAttribute('aria-controls', suggestionsContainerId)
    $combobox.setAttribute('aria-combobox', 'list')
    $combobox.setAttribute('aria-expanded', 'false')

    if (this.removePasswordWidgets) {
      $combobox.setAttribute('data-1p-ignore', '') // Disable 1 password widget
      $combobox.setAttribute('data-lpignore', 'true') // Disable last password widget
    }

    $select.replaceWith($combobox)
  }

  /**
   * @param {Record<string, string|string[]>} queryParams
   */
  setHiddenInputs(queryParams = {}) {
    this.$hiddenInputs.forEach(($input) => $input.remove())
    this.$hiddenInputs = []

    for (const [name, values] of Object.entries(queryParams)) {
      const items = Array.isArray(values) ? values : [values]

      for (const value of items) {
        if (value === undefined || value === null || value === '') {
          continue
        }

        const $input = document.createElement('input')
        $input.type = 'hidden'
        $input.name = name
        $input.value = String(value)

        this.$combobox.after($input)
        this.$hiddenInputs.push($input)
      }
    }
  }

  /**
   * Get raw suggestion that is not disabled, by value
   * @param {string|number} value
   * @returns Suggestion | undefined
   */
  getSuggestionByValue(value) {
    if (Array.isArray(value)) {
      return
    }

    return window.cdp.suggestions?.[this.name].find(
      (suggestion) =>
        suggestion.disabled !== true &&
        suggestion.value?.toLowerCase() === value?.trim()?.toLowerCase()
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
        suggestion.text?.toLowerCase() === textValue?.trim()?.toLowerCase()
    )
  }

  /**
   * @param {string|number} textValue
   * @returns {HTMLLIElement}
   */
  getSuggestionMarkup(textValue) {
    return this.getSuggestionsMarkup().find((suggestion) => {
      return (
        suggestion.dataset.text?.toLowerCase() ===
        textValue?.trim()?.toLowerCase()
      )
    })
  }

  /**
   * @param {string|number} textValue
   * @returns {number}
   */
  getSuggestionIndex(textValue) {
    return this.getSuggestionsMarkup().findIndex(
      (suggestion) =>
        suggestion.dataset.text?.toLowerCase() ===
        textValue?.trim()?.toLowerCase()
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

    $li.classList.add('app-combobox__suggestion')
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

    $li.id = `app-combobox-${name}-suggestion-${index}`
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

    if (item.queryParams) {
      $li.dataset.queryParams = JSON.stringify(item.queryParams)
    }

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
    return this.$combobox.dispatchEvent(new Event('blur', { bubbles: true }))
  }

  dispatchInputEvent() {
    this.$combobox.dispatchEvent(new Event('input', { bubbles: true }))
  }

  dispatchChangeEvent() {
    this.$combobox.dispatchEvent(new Event('change', { bubbles: true }))
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
    this.$suggestionsContainer.classList.add('app-combobox__suggestions--show')
    this.$suggestionsContainer.setAttribute('aria-expanded', 'true')

    this.$combobox.setAttribute('aria-expanded', 'true')

    this.$chevronButton.classList.add('app-combobox__chevron-button--open')
    this.$chevronButton.setAttribute('aria-label', 'Hide')

    this.scrollToMatch()
  }

  closeSuggestions() {
    this.$suggestionsContainer.scrollTop = 0
    this.$suggestionsContainer.classList.remove(
      'app-combobox__suggestions--show'
    )
    this.$suggestionsContainer.setAttribute('aria-expanded', 'false')

    this.$combobox.setAttribute('aria-expanded', 'false')

    this.$chevronButton.classList.remove('app-combobox__chevron-button--open')
    this.$chevronButton.setAttribute('aria-label', 'Show')
  }

  showCloseButton() {
    this.$clearButton.classList.add('app-combobox__clear-button--show')
    this.$clearButton.setAttribute('aria-hidden', 'false')
    this.$clearButton.setAttribute('aria-label', 'Clear')
  }

  hideCloseButton() {
    this.$clearButton.classList.remove('app-combobox__clear-button--show')
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
    const textValueTrimmed = textValue?.trim()
    const match = this.getSuggestionMarkup(textValueTrimmed)

    if (match?.value) {
      // combobox input value exact matches a suggestion
      const filterExactMatch = this.filterExactMatch(textValueTrimmed)
      return this.getSuggestionsMarkup()
        .filter(filterExactMatch)
        .map(
          this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
        )
    } else if (textValueTrimmed) {
      // Partial match
      const filterPartialMatch = this.filterPartialMatch(textValueTrimmed)
      return this.getSuggestionsMarkup()
        .filter(filterPartialMatch)
        .map(
          this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
        )
    } else {
      // Reset suggestions
      return this.getSuggestionsMarkup().map(
        this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
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
      this.$combobox.setAttribute(
        'aria-activedescendant',
        `app-combobox-${this.$select.name}-suggestion-${highlightIndex}`
      )
    }

    if (suggestionIndex === null) {
      this.$combobox.removeAttribute('aria-activedescendant')
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
    const className = 'app-combobox__suggestion--highlight'

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
      $suggestion.lastChild.appendChild($tickIcon)
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
   * - When suggestions have not been populated and need a prior action to populate suggestions in the combobox
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
      'app-combobox__suggestion',
      'app-combobox__suggestion--no-results'
    )
    $li.setAttribute('role', 'option')
    $li.dataset.interactive = 'false'
    $li.textContent = message

    return $li
  }

  setupSubscription() {
    subscribe(this.subscribeTo, this.resetCombobox.bind(this))
  }

  publishEvent(name, value) {
    publish(this.publishTo, { queryParams: { [name]: value } })
  }

  /**
   * @typedef {object} Input
   * @property {string|undefined} text - the visual text you see in the input
   * @property {string|undefined} value - the value set to the hidden input
   * @property {Record<string, string|string[]>} [queryParams]
   */

  /**
   * Set input text value and hidden input value. Both can be empty strings or undefined
   * Also dispatch publish event if setup and call fetcher if enabled
   * @param {Input} args
   */
  updateInputValue({ text, value, queryParams, withPublish = true } = {}) {
    const inputText = text ?? ''
    const inputValue = value ?? ''

    this.$combobox.value = inputText

    this.setHiddenInputs(
      queryParams ?? {
        [this.$select.name]: inputValue
      }
    )

    if (this.publishTo && withPublish) {
      this.publishEvent(this.$select.name, inputValue)
    }
  }

  resetComboboxValues() {
    this.updateInputValue({ text: '', value: '' })
  }

  resetCombobox() {
    this.resetComboboxValues()
    this.hideCloseButton()

    this.getSuggestionsMarkup()
    this.populateSuggestions({
      textValue: this.$combobox.value,
      suggestionIndex: this.suggestionIndex
    })
  }

  // Action to perform when a choice is made by the user click or enter in suggestions, enter or typing in input
  choiceAction() {
    this.dispatchInputEvent()

    // Give the dropdown time to update
    setTimeout(() => {
      this.dispatchChangeEvent()
    }, 100)
  }

  comboboxInputEvent(event) {
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

    if (this.allowReselection) {
      const matchIndex = this.getSuggestionIndex(textValue)
      this.suggestionIndex = matchIndex > -1 ? matchIndex : null
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
        value: foundSuggestion.value,
        queryParams: foundSuggestion.queryParams
      })
      return
    }

    // Only send request to search on typing if component is a typeahead. Always clear if value is empty
    if (this.typeahead ?? !textValue) {
      this.updateInputValue({ text: textValue, value: textValue })
    }
  }

  clearButtonClickEvent() {
    this.resetComboboxValues()
    this.$combobox.focus()

    this.hideCloseButton()

    this.populateSuggestions({
      textValue: this.$combobox.value,
      suggestionIndex: null
    })

    this.dispatchChangeEvent()
  }

  addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      const initializecombobox = async () => {
        if (this.$noJsSubmitButton) {
          this.$noJsSubmitButton.remove()
        }

        const queryParamValue = this.queryParams?.[this.name]

        if (queryParamValue && !Array.isArray(queryParamValue)) {
          const suggestion = this.getSuggestionByValue(queryParamValue)

          const text = suggestion?.text ?? queryParamValue
          const value = suggestion?.value ?? queryParamValue
          this.updateInputValue({ text, value, withPublish: false })
          this.showCloseButton()
        }

        if (this.$combobox.value) {
          this.showCloseButton()
          const matchIndex = this.getSuggestionIndex(this.$combobox.value)

          this.populateSuggestions({
            textValue: this.$combobox.value,
            suggestionIndex: matchIndex > -1 ? matchIndex : null
          })
        }
      }

      initializecombobox().catch(clientNotification)
    })

    this.$clearButton.addEventListener(
      'click',
      this.clearButtonClickEvent.bind(this)
    )

    this.$chevronButton.addEventListener('click', (event) => {
      event.stopPropagation()

      this.populateSuggestions({
        textValue: !this.allowReselection ? this.$combobox.value : null,
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
      if (event.target !== this.$combobox && this.isSuggestionsOpen()) {
        this.closeSuggestions()
        this.populateSuggestions({ suggestionIndex: null })
      }
    })

    // User focus into the input
    this.$combobox.addEventListener('focus', (event) => {
      const textValue = event?.target?.value

      this.populateSuggestions({
        textValue,
        suggestionIndex: null
      })
      this.openSuggestions()
    })

    // Mouse clicks into the input
    this.$combobox.addEventListener('click', (event) => {
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
    this.$combobox.addEventListener('input', this.comboboxInputEvent.bind(this))

    // Mainly keyboard navigational events
    this.$combobox.addEventListener('keydown', (event) => {
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
          if (!this.$combobox.value) {
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
            value: $currentSuggestion.dataset?.value,
            queryParams: JSON.parse(
              $currentSuggestion.dataset?.queryParams ?? 'null'
            )
          })

          this.choiceAction()
          this.suggestionIndex = null
        }

        if (this.$combobox.value) {
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

      const $suggestion = event?.target?.closest('.app-combobox__suggestion')

      if ($suggestion && $suggestion.dataset.interactive !== 'false') {
        this.updateInputValue({
          text: $suggestion?.dataset?.text,
          value: $suggestion?.dataset?.value,
          queryParams: JSON.parse($suggestion?.dataset?.queryParams ?? 'null')
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
