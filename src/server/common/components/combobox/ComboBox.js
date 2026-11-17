import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import template from './template.njk'

export default class ComboBox extends NunjucksComponent {
  #options = []
  #suggestions = []
  #inputElement
  #selectedValue

  constructor() {
    super(template)
  }

  get managedListeners() {
    return [
      [this.#inputElement, 'focus', this.#onFocus],
      [document, 'click', this.#onDocumentClick],
      [this.#inputElement, 'input', this.#onInput]
    ]
  }

  mounted() {
    this.#inputElement = this.querySelector('input')

    const $options = this.querySelectorAll('select > option') ?? []
    $options.forEach(($option) => {
      if ($option.value) {
        this.#options.push({
          value: $option.value,
          text: $option.textContent?.trim()
        })

        if ($option.selected) {
          this.#selectedValue = $option.value
        }
      }
    })
  }

  render() {
    this.morph(template, {
      ...this.dataset,
      suggestionText: this.#inputElement.value,
      value: this.#selectedValue,
      options: this.#options,
      suggestions: this.#suggestions
    })
  }

  #onFocus() {
    this.#suggestions = this.#getSuggestions(this.#inputElement.value)
    this.render()
  }

  #onDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.#suggestions = []
      this.render()
    }
  }

  #onInput() {
    this.#suggestions = this.#getSuggestions(this.#inputElement.value)
    this.render()
  }

  #getSuggestions(value) {
    const testValue = value.trim().toLowerCase()
    const suggestions = this.#options.filter((option) =>
      option.text?.toLowerCase()?.includes(testValue)
    )

    if (suggestions.length) return suggestions

    return testValue ? [{ text: '- - no results - - ', disabled: true }] : []
  }
}

window.customElements.define('app-combobox', ComboBox)
