import qs from 'qs'
import { isNull } from 'lodash'

import { subscribe } from '~/src/client/common/helpers/event-emitter'

const tickSvgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" class="app-tick-icon" width="48" height="48" viewBox="0 -960 960 960"><path d="m419-285 291-292-63-64-228 228-111-111-63 64 174 175Zm60.679 226q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z"/></svg>`.trim()

class Autocomplete {
  constructor($module) {
    if (!($module instanceof HTMLElement)) {
      return
    }

    this.$module = $module
    this.$select = this.$module.querySelector(
      `[data-js*="app-progressive-input"]`
    )

    this.enhanceSelectWithAutocomplete()

    this.$autocomplete = this.$module.querySelector(
      '[data-js="app-autocomplete-input"]'
    )
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
    this.isSuggestionsHidden = !this.$suggestionsContainer.classList.contains(
      'app-autocomplete__suggestions--show'
    )

    this.suggestionIndex = null
    this.suggestionsLength = this.getSuggestions().length

    if (this.subscribeTo) {
      this.setupSubscription()
    }

    this.addEventListeners()
  }

  enhanceSelectWithAutocomplete() {
    const $select = this.$select
    const suggestionsContainerId = `app-autocomplete-${$select.id}-suggestions`
    const $autocomplete = document.createElement('input')

    this.subscribeTo = $select.dataset.subscribeTo
    this.previousChoiceMessage = $select.dataset.previousChoiceMessage

    $autocomplete.name = $select.name
    $autocomplete.id = $select.id
    $autocomplete.value = $select.value
    $autocomplete.classList.add('govuk-input', 'app-autocomplete__input')
    $autocomplete.placeholder = ' - - select - - '
    $autocomplete.dataset.js = 'app-autocomplete-input'
    $autocomplete.dataset.testid = 'app-autocomplete-input'
    $autocomplete.setAttribute('autocapitalize', 'none')
    $autocomplete.setAttribute('autocomplete', 'off')
    $autocomplete.setAttribute('role', 'combobox')
    $autocomplete.setAttribute('aria-controls', suggestionsContainerId)
    $autocomplete.setAttribute('aria-autocomplete', 'list')
    $autocomplete.setAttribute('aria-expanded', 'false')
    $autocomplete.setAttribute('data-1p-ignore', '') // Disable 1 password widget

    $select.replaceWith($autocomplete)
  }

  getSuggestions() {
    const inputName = this.$autocomplete.name
    const suggestions = window.suggestions?.[inputName] ?? []
    const suggestionElement = this.createSuggestion()

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
    this.$autocomplete.dispatchEvent(new Event('input'))
  }

  scrollToHighlight() {
    const $hasHighlight = this.$suggestionsContainer.querySelector(
      '[data-has-highlight="true"]'
    )

    if ($hasHighlight) {
      $hasHighlight.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }

  scrollToMatch() {
    const $match = this.$suggestionsContainer.querySelector(
      '[data-is-match="true"]'
    )

    if ($match) {
      $match.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }

  openSuggestions() {
    this.suggestionIndex = null
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
    this.suggestionIndex = null
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

  hasExactCaseInsensitiveMatch(value) {
    return this.getSuggestions().find(
      (suggestion) =>
        suggestion.dataset.value?.toLowerCase() === value?.toLowerCase()
    )
  }

  populateSuggestions({ value, suggestionIndex } = {}) {
    let $suggestions

    if (this.hasExactCaseInsensitiveMatch(value)) {
      $suggestions = this.getSuggestions().map(
        this.dressSuggestion({ value, suggestionIndex })
      )
    } else if (value) {
      // Partial match
      $suggestions = this.getSuggestions()
        .filter(($suggestion) =>
          $suggestion.dataset?.text.toLowerCase().includes(value?.toLowerCase())
        )
        .map(this.dressSuggestion({ value, suggestionIndex }))
    } else {
      // Reset
      $suggestions = this.getSuggestions().map(
        this.dressSuggestion({ value, suggestionIndex })
      )
    }

    $suggestions = $suggestions.length
      ? $suggestions
      : [this.buildNoResults(value)]

    this.$suggestionsContainer.replaceChildren(...$suggestions)
    this.suggestionsLength = $suggestions.length
    this.suggestionIndex = suggestionIndex

    const oneBasedIndex = suggestionIndex + 1

    if (oneBasedIndex) {
      this.$autocomplete.setAttribute(
        'aria-activedescendant',
        `app-autocomplete-${this.$autocomplete.name}-suggestion-${oneBasedIndex}`
      )
    }

    return $suggestions
  }

  createSuggestion() {
    const $span = document.createElement('span')

    const $itemValue = $span.cloneNode(true)
    $itemValue.classList.add('app-suggestion__value')

    const $hintContent = $span.cloneNode(true)
    $hintContent.classList.add('app-suggestion__hint')

    const $action = $span.cloneNode(true)
    $action.classList.add('app-suggestion__action')

    const $li = document.createElement('li')

    $li.classList.add('app-autocomplete__suggestion')
    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($hintContent)
    $li.appendChild($action)

    return $li
  }

  buildSuggestion(item, $listElement, index, size, name) {
    if (item.disabled) {
      return null
    }

    const $li = $listElement.cloneNode(true)

    $li.id = `app-autocomplete-${name}-suggestion-${index}`
    $li.setAttribute('aria-posinset', index)
    $li.setAttribute('aria-setsize', size)

    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value

    if (item.hint) {
      $li.dataset.hint = item.hint
      $li.firstElementChild.nextElementSibling.textContent = item.hint
    }

    return $li
  }

  manageTextHighlight($suggestion, value = null) {
    if (value) {
      $suggestion.firstElementChild.innerHTML =
        $suggestion.dataset?.value.replace(
          new RegExp(value, 'gi'),
          `<strong>$&</strong>`
        )
      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        $suggestion.dataset?.hint.replace(
          new RegExp(value, 'gi'),
          `<strong>$&</strong>`
        )
    } else {
      $suggestion.firstElementChild.innerHTML = $suggestion.dataset?.value
      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        $suggestion.dataset?.hint
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

  manageMatch($suggestion, value = null) {
    if (
      value &&
      value?.toLowerCase() === $suggestion.dataset?.value?.toLowerCase()
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

  dressSuggestion({ value, suggestionIndex } = {}) {
    return ($suggestion, index) => {
      this.manageTextHighlight($suggestion, value)
      this.manageChoiceHighlight($suggestion, index, suggestionIndex)
      this.manageMatch($suggestion, value)

      return $suggestion
    }
  }

  buildNoResults(value) {
    const $li = document.createElement('li')

    $li.classList.add(
      'app-autocomplete__suggestion',
      'app-autocomplete__suggestion--no-results'
    )
    $li.setAttribute('role', 'option')
    $li.textContent = value
      ? ' - - no result - - '
      : this.previousChoiceMessage
        ? ` - - ${this.previousChoiceMessage} - - `
        : ' - - previous choice needed - - '

    return $li
  }

  setupSubscription() {
    subscribe(this.subscribeTo, () => {
      this.$autocomplete.value = ''
      this.hideCloseButton()

      this.getSuggestions()
      this.populateSuggestions({
        value: this.$autocomplete.value,
        suggestionIndex: this.suggestionIndex
      })
    })
  }

  addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.$noJsSubmitButton.remove()

      const queryParamValue = this.queryParams?.[this.$autocomplete.name]

      if (queryParamValue) {
        this.$autocomplete.value = queryParamValue
        this.showCloseButton()
      }

      if (this.$autocomplete.value) {
        this.showCloseButton()
      }

      this.populateSuggestions({
        value: this.$autocomplete.value,
        suggestionIndex: this.suggestionIndex
      })
    })

    this.$clearButton.addEventListener('click', () => {
      this.$autocomplete.value = ''
      this.$autocomplete.focus()

      this.hideCloseButton()
      this.populateSuggestions({
        value: this.$autocomplete.value,
        suggestionIndex: this.suggestionIndex
      })
    })

    this.$chevronButton.addEventListener('click', (event) => {
      event.stopPropagation()

      this.populateSuggestions({
        value: this.$autocomplete.value,
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
        this.populateSuggestions()
      }
    })

    // User focus into the input
    this.$autocomplete.addEventListener('focus', (event) => {
      const value = event?.target?.value

      this.populateSuggestions({ value, suggestionIndex: this.suggestionIndex })
      this.openSuggestions()
    })

    // Mouse clicks into the input
    this.$autocomplete.addEventListener('click', (event) => {
      this.dispatchDocumentClickEvent()

      event.stopPropagation()

      const value = event?.target?.value

      if (value) {
        this.showCloseButton()
      } else {
        this.hideCloseButton()
      }

      this.populateSuggestions({ value, suggestionIndex: this.suggestionIndex })
      this.openSuggestions()
    })

    // User typing inside input
    this.$autocomplete.addEventListener('input', (event) => {
      if (this.isSuggestionsHidden) {
        this.openSuggestions()
      }

      this.suggestionIndex = null // Typing in input, no current highlight of suggestion, reset selection index

      const value = event?.target?.value

      if (value) {
        this.showCloseButton()
      } else {
        this.hideCloseButton()
        this.$suggestionsContainer.scrollTop = 0 // Move suggestions window scroll bar to top
      }

      this.populateSuggestions({ value, suggestionIndex: this.suggestionIndex })
    })

    // Mainly keyboard navigational events
    this.$autocomplete.addEventListener('keydown', (event) => {
      const code = event.code.toLowerCase()
      const value = event.target.value

      if ((code === 'backspace' && !value) || code === 'escape') {
        this.closeSuggestions()
      }

      // Tab rather than blur is used to hide suggestions, as blur fires when clicking suggestion in suggestions container
      if (code === 'tab') {
        this.closeSuggestions()
        this.dispatchBlurEvent()
      }

      if (code === 'arrowup') {
        if (isNull(this.suggestionIndex)) {
          this.suggestionIndex = this.suggestionsLength - 1
        } else {
          this.suggestionIndex--
        }

        // When the first suggestion is passed send to last
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

        // When last suggestion is passed send to first
        if (this.suggestionIndex > this.suggestionsLength - 1) {
          this.suggestionIndex = 0
        }

        // If suggestion closed, open suggestion on down arrow press
        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }
      }

      if (['arrowup', 'arrowdown'].includes(code)) {
        // This is managing the highlights
        const $filteredSuggestions = this.populateSuggestions({
          value,
          suggestionIndex: this.suggestionIndex
        })

        const $currentSuggestion = $filteredSuggestions.at(this.suggestionIndex)

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
        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }

        this.populateSuggestions({
          value: '',
          suggestionIndex: 0
        })
        this.scrollToHighlight()
      }

      if (code === 'end') {
        if (!this.isSuggestionsOpen()) {
          this.openSuggestions()
        }

        this.populateSuggestions({
          value: '',
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
          // Otherwise default the enter in input functionality to a form submit
        }

        if (!isNull(this.suggestionIndex)) {
          // User has used arrow keys to make selection of a suggestion and pressed enter
          const $filteredSuggestions = this.populateSuggestions({
            value,
            suggestionIndex: this.suggestionIndex
          })
          const $currentSuggestion = $filteredSuggestions?.at(
            this.suggestionIndex
          )

          this.$autocomplete.value = $currentSuggestion.dataset?.value ?? ''
          this.dispatchInputEvent()
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

      const suggestion = event?.target?.closest('.app-autocomplete__suggestion')
      const value = suggestion?.dataset?.value ?? ''

      if (suggestion) {
        this.$autocomplete.value = value
        this.dispatchInputEvent()

        this.populateSuggestions({
          value,
          suggestionIndex: this.suggestionIndex
        })

        this.closeSuggestions()
        this.showCloseButton()
      }
    })
  }
}

export { Autocomplete }
