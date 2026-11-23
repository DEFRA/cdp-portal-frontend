import template from './template.njk'
import suggestionsTemplate from './suggestions.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { nunjucksEnvironment } from '#config/nunjucks/client.js'

export default class Combobox extends NunjucksComponent {
  #options = []
  #suggestions = []

  #selectedValue
  #suggestionText

  #selectElement
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
          text: $option.textContent?.trim(),
          hint: $option.dataset.hint?.trim()
        })

        if ($option.selected) {
          this.#selectedValue = $option.value
        }
      }
    })

    this.#suggestionText = this.#inputElement.value
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
      suggestionText: this.#suggestionText,
      value: this.#selectedValue,
      options: this.#options,
      suggestions: this.#suggestions
    })
  }

  // Render optimized for speed
  renderSuggestions() {
    const html = nunjucksEnvironment.render(suggestionsTemplate, {
      params: {
        value: this.#selectedValue
      },
      suggestions: this.#suggestions,
      suggestionText: this.#suggestionText
    })

    this.#suggestionsContainer.innerHTML = html

    if (this.#suggestions.length) {
      this.#suggestionsContainer.classList.add(
        'app-combobox__suggestions--show'
      )
    } else {
      this.#suggestionsContainer.classList.remove(
        'app-combobox__suggestions--show'
      )
    }

    this.#suggestionsContainer.setAttribute(
      'aria-expanded',
      this.#suggestions.length === 0 ? 'false' : 'true'
    )

    if (this.#suggestionText) {
      this.#clearButton.classList.add('app-combobox__clear-button--show')
    } else {
      this.#clearButton.classList.remove('app-combobox__clear-button--show')
    }

    this.#chevronButton.setAttribute(
      'aria-lable',
      this.#suggestions.length === 0 ? 'Show' : 'Hide'
    )

    if (this.#suggestions.length === 0) {
      this.#chevronButton.classList.remove(
        'app-typeahead__chevron-button--open'
      )
    } else {
      this.#chevronButton.classList.add('app-typeahead__chevron-button--open')
    }
  }

  #onFocus() {
    this.#suggestionText = this.#inputElement.value
    this.#suggestions = this.#getSuggestions(this.#suggestionText)
    this.renderSuggestions()
  }

  async #onKeyDown(event) {
    const code = event.code.toLowerCase()
    const textValue = event.target.value

    if ((code === 'backspace' && !textValue) || code === 'escape') {
      this.#suggestions = []
      this.renderSuggestions()
    } else if (code === 'tab') {
      this.#suggestions = []
      this.renderSuggestions()

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
    this.#suggestionText = this.#inputElement.value
    this.#suggestions = this.#getSuggestions(this.#suggestionText)
    this.renderSuggestions()
  }

  async #onSuggestionsKeyDown(event) {
    if (!(event.target instanceof HTMLInputElement)) return

    const code = event.code.toLowerCase()
    const optionValue = event.target.value

    if (code === 'escape') {
      this.#inputElement.focus()

      this.#suggestions = []
      this.renderSuggestions()
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
      this.#suggestionText =
        this.#options.find((option) => option.value === optionValue)?.text ?? ''

      this.#suggestions = []
      await this.render()

      this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  async #onSuggestionsClick(event) {
    const item = event.target.closest('li')
    const label = item.querySelector('label')
    if (!label) return
    const optionValue = label.control.value

    this.#selectedValue = optionValue
    this.#suggestionText =
      this.#options.find((option) => option.value === optionValue)?.text ?? ''

    this.#suggestions = []
    await this.render()

    this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
  }

  #onSuggestionsChange(event) {
    event.stopPropagation()
  }

  async #onClearButtonClick() {
    this.#selectedValue = undefined
    this.#suggestionText = ''

    this.#suggestions = []
    await this.render()

    this.#selectElement.dispatchEvent(new Event('change', { bubbles: true }))
  }

  #onChevronButtonClick() {
    if (this.#suggestions.length) {
      this.#suggestions = []
    } else {
      this.#suggestions = this.#getSuggestions(this.#suggestionText)
    }

    this.renderSuggestions()
  }

  #onDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.#suggestions = []
      this.renderSuggestions()
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

window.customElements.define('app-combobox', Combobox)
