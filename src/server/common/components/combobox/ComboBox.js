import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import template from './template.njk'

export default class ComboBox extends NunjucksComponent {
  #options = []
  #suggestions = []
  #selectElement
  #inputElement
  #suggestionsContainer
  #clearButton
  #chevronButton
  #selectedValue

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
      [this.#clearButton, 'click', this.#onClearButtonClick],
      [this.#chevronButton, 'click', this.#onChevronButtonClick],
      [document, 'click', this.#onDocumentClick]
    ]
  }

  mounted() {
    this.#selectElement = this.querySelector('select')
    this.#inputElement = this.querySelector('input')
    this.#suggestionsContainer = this.querySelector(
      `#app-combobox-${this.dataset.id}-suggestions`
    )
    this.#clearButton = this.querySelector(
      `#app-combobox-${this.dataset.id}-clear-button`
    )
    this.#chevronButton = this.querySelector(
      `#app-combobox-${this.dataset.id}-chevron-button`
    )

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

  async render() {
    return this.morph(template, {
      ...this.dataset,
      label: {
        text: this.dataset.labelText,
        classes: this.dataset.labelClasses
      },
      hint: {
        text: this.dataset.hintText,
        html: this.dataset.hintHtml
      },
      formGroup: {
        classes: this.dataset.formgroupClasses
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

  async #onKeyDown(event) {
    const code = event.code.toLowerCase()
    const textValue = event.target.value

    if ((code === 'backspace' && !textValue) || code === 'escape') {
      this.#suggestions = []
      this.render()
    } else if (code === 'tab') {
      this.#suggestions = []
      await this.render()

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

  #onInput() {
    this.#suggestions = this.#getSuggestions(this.#inputElement.value)
    this.render()
  }

  async #onSuggestionsKeyDown(event) {
    if (!(event.target instanceof HTMLInputElement)) return

    const code = event.code.toLowerCase()
    const optionValue = event.target.value

    if (code === 'escape') {
      this.#inputElement.focus()

      this.#suggestions = []
      this.render()
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
      this.#inputElement.value =
        this.#options.find((option) => option.value === optionValue)?.text ?? ''

      this.#suggestions = []
      await this.render()

      this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  async #onSuggestionsClick(event) {
    if (!(event.target instanceof HTMLLabelElement)) return
    const optionValue = event.target.control.value

    this.#selectedValue = optionValue
    this.#inputElement.value =
      this.#options.find((option) => option.value === optionValue)?.text ?? ''

    this.#suggestions = []
    await this.render()

    this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
  }

  async #onClearButtonClick() {
    this.#selectedValue = undefined
    this.#inputElement.value = '' // TODO: update state not element

    this.#suggestions = []
    await this.render()

    this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
  }

  #onChevronButtonClick() {
    if (this.#suggestions.length) {
      this.#suggestions = []
    } else {
      this.#suggestions = this.#getSuggestions(this.#inputElement.value)
    }

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
