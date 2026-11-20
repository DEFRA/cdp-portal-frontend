import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class Typeahead extends NunjucksComponent {
  #options = []
  #suggestions = []

  #selectedValue
  #suggestionText

  #inputElement
  #suggestionsContainer
  #clearButton
  #chevronButton

  constructor() {
    super(template)
  }

  get managedListeners() {
    return [
      [this.#inputElement, 'focus', this.#onFocus],
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

  async render() {}

  #onFocus() {}

  async #onKeyDown(event) {}

  #onInput() {}

  async #onSuggestionsKeyDown(event) {}

  async #onSuggestionsClick(event) {}

  #onSuggestionsChange(event) {
    event.stopPropagation()
  }

  async #onClearButtonClick() {}

  #onChevronButtonClick() {}

  #onDocumentClick(event) {}
}

window.customElements.define('app-typeahead', Typeahead)
