import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import template from './template.njk'

export default class ComboBox extends NunjucksComponent {
  #options = []
  #suggestions = []
  #inputElement

  constructor() {
    super(template)
  }

  get managedListeners() {
    return [
      [this.#inputElement, 'focus', this.#onFocus],
      [this.#inputElement, 'blur', this.#onBlur]
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
      }
    })
  }

  render() {
    this.morph(template, {
      ...this.dataset,
      options: this.#options,
      suggestions: this.#suggestions
    })
  }

  #onFocus() {
    //   this.populateSuggestions({
    //     textValue,
    //     suggestionIndex: null
    //   })

    this.#suggestions = this.#options
    this.render()
  }

  #onBlur() {
    this.#suggestions = []
    this.render()
  }
}

window.customElements.define('app-combobox', ComboBox)
