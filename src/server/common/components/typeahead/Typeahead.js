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

  async #onKeyDown(event) {}

  #onInput() {}

  async #onSuggestionsKeyDown(event) {}

  async #onSuggestionsClick(event) {}

  #onSuggestionsChange(event) {
    event.stopPropagation()
  }

  async #onClearButtonClick() {}

  #onChevronButtonClick() {
    if (this.#chevronButton.getAttribute('aria-lable') === 'Hide') {
      this.#chevronButton.setAttribute('aria-lable', 'Show')
      this.#chevronButton.classList.remove(
        'app-typeahead__chevron-button--open'
      )
    } else {
      this.#chevronButton.setAttribute('aria-lable', 'Hide')
      this.#chevronButton.classList.add('app-typeahead__chevron-button--open')
    }
  }

  #onDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.clearSuggestions()
    }
  }
}

window.customElements.define('app-typeahead', Typeahead)
