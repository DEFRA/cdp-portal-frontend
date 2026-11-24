import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class Typeahead extends NunjucksComponent {
  #selectedValue
  #suggestionText

  #inputElement
  #suggestionsContainer
  #clearButton
  #chevronButton

  get managedListeners() {
    return [
      [this.#inputElement, 'keydown', this.#onKeyDown],
      [this.#inputElement, 'focus', this.#onFocus],
      [this.#inputElement, 'input', this.#onInput],
      [this.#suggestionsContainer, 'keydown', this.#onSuggestionsKeyDown],
      [this.#suggestionsContainer, 'click', this.#onSuggestionsClick],
      [this.#suggestionsContainer, 'change', this.#onSuggestionsChange],
      [this.#clearButton, 'click', this.#onClearButtonClick],
      [this.#chevronButton, 'click', this.#onChevronButtonClick],
      [document, 'click', this.#onDocumentClick]
    ]
  }

  mounted() {
    this.#inputElement = this.querySelector('input')
    this.#suggestionsContainer = this.querySelector(
      `#app-typeahead-${this.dataset.id}-suggestions`
    )
    this.#clearButton = this.querySelector(
      `#app-typeahead-${this.dataset.id}-clear-button`
    )
    this.#chevronButton = this.querySelector(
      `#app-typeahead-${this.dataset.id}-chevron-button`
    )

    this.#suggestionText = this.#inputElement.value
  }

  clearSuggestions() {
    this.#suggestionsContainer.innerHTML = ''

    this.#suggestionsContainer.classList.remove(
      'app-typeahead__suggestions--show'
    )

    this.#suggestionsContainer.setAttribute('aria-expanded', 'false')

    if (this.#suggestionText) {
      this.#clearButton.classList.add('app-typeahead__clear-button--show')
    } else {
      this.#clearButton.classList.remove('app-typeahead__clear-button--show')
    }

    this.#chevronButton.setAttribute('aria-lable', 'Show')
    this.#chevronButton.classList.remove('app-typeahead__chevron-button--open')
  }

  async #onKeyDown(event) {
    const code = event.code.toLowerCase()
    const textValue = event.target.value

    if ((code === 'backspace' && !textValue) || code === 'escape') {
      this.clearSuggestions()
    } else if (code === 'tab') {
      this.clearSuggestions()
      this.#inputElement.dispatchEvent(new Event('blur', { bubbles: true }))
    } else if (code === 'arrowdown' || code === 'home') {
      event.preventDefault()

      const firstOption = [
        ...this.querySelectorAll('input:not([type="text"])')
      ].at(0)
      firstOption?.focus()
    } else if (code === 'end') {
      event.preventDefault()

      const lastOption = [
        ...this.querySelectorAll('input:not([type="text"])')
      ].at(-1)
      lastOption?.focus()
    }
  }

  #onFocus() {
    this.#chevronButton.setAttribute('aria-lable', 'Hide')
    this.#chevronButton.classList.add('app-typeahead__chevron-button--open')
  }

  #onInput() {
    this.#suggestionText = this.#inputElement.value

    if (this.#suggestionText) {
      this.#clearButton.classList.add('app-typeahead__clear-button--show')
    } else {
      this.#clearButton.classList.remove('app-typeahead__clear-button--show')
    }
  }

  async #onSuggestionsKeyDown(event) {
    if (!(event.target instanceof HTMLInputElement)) return

    const code = event.code.toLowerCase()
    const optionValue = event.target.value

    if (code === 'escape') {
      this.#inputElement.focus()
      this.clearSuggestions()
    } else if (code === 'home') {
      event.preventDefault()

      const firstOption = [
        ...this.querySelectorAll('input:not([type="text"])')
      ].at(0)
      firstOption?.focus()
    } else if (code === 'end') {
      event.preventDefault()

      const lastOption = [
        ...this.querySelectorAll('input:not([type="text"])')
      ].at(-1)
      lastOption?.focus()
    } else if (code === 'enter') {
      this.#selectedValue = optionValue
      this.#suggestionText = optionValue
      this.#inputElement.value = this.#suggestionText
      this.#inputElement.dispatchEvent(new Event('change', { bubbles: true }))

      this.clearSuggestions()
    }
  }

  async #onSuggestionsClick(event) {
    if (event.target instanceof HTMLInputElement) return // Keyboard selection

    const item = event.target.closest('li')
    const label = item.querySelector('label')
    if (!label) return

    const optionValue = label.control.value
    this.#suggestionText = optionValue
    this.#inputElement.value = this.#suggestionText

    this.clearSuggestions()
  }

  #onSuggestionsChange(event) {
    event.stopPropagation()
  }

  async #onClearButtonClick() {
    this.#suggestionText = ''
    this.#inputElement.value = this.#suggestionText
    this.#inputElement.dispatchEvent(new Event('change', { bubbles: true }))

    this.clearSuggestions()
  }

  #onChevronButtonClick() {
    if (this.#chevronButton.getAttribute('aria-lable') === 'Hide') {
      this.clearSuggestions()
    } else {
      this.#inputElement.focus()
    }
  }

  #onDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.clearSuggestions()
    }
  }
}

window.customElements.define('app-typeahead', Typeahead)
