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
      [this.#inputElement, 'keydown', this.#onKeyDown],
      [this.#inputElement, 'input', this.#onInput],
      [document, 'click', this.#onDocumentClick]
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
      label: {
        text: this.dataset.labelText,
        classes: this.dataset.labelClasses
      },
      hint: {
        text: this.dataset.hintText,
        html: this.dataset.hintHtml
      },
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

  #onKeyDown(event) {
    const code = event.code.toLowerCase()
    const textValue = event.target.value

    if ((code === 'backspace' && !textValue) || code === 'escape') {
      this.#suggestions = []
      this.render()
      return
    }

    if (code === 'tab') {
      this.#suggestions = []
      this.render()
      this.#inputElement.dispatchEvent(new Event('blur', { bubbles: true }))
    }
  }

  #onInput() {
    this.#suggestions = this.#getSuggestions(this.#inputElement.value)
    this.render()
  }

  #onDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.#suggestions = []
      this.render()
    }
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
