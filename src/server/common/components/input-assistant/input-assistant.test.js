import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { inputAssistant } from './input-assistant.js'

describe('#inputAssistant', () => {
  let inputElem
  let inputAssistantElem

  beforeEach(() => {
    vi.useFakeTimers()

    const $component = renderTestComponent('input-assistant', {
      params: {
        message: "Have a read of 'Naming your microservice best practice'",
        targetId: 'input-assistant'
      }
    })

    // Add component with companion input
    document.body.innerHTML = `<div>
        <input type="text"
               data-js="test-input"
               data-input-assistant-target-id="input-assistant"
               data-testid="app-input" />

        ${$component('[data-testid="app-input-assistant"]').toString()}
      </div>`

    // Init ClientSide JavaScript
    const assistantInputs = Array.from(
      document.querySelectorAll('[data-js="test-input"]')
    )

    if (assistantInputs.length) {
      assistantInputs.forEach(($assistantInput) =>
        inputAssistant($assistantInput)
      )
    }

    inputElem = document.querySelector('[data-testid="app-input"]')
    inputAssistantElem = document.querySelector('.app-input-assistant__content')
  })

  describe('When input contains no un-recommended words', () => {
    test('Should not show input assistant message', () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true
      })

      inputElem.value = 'awesome-service'
      inputElem.dispatchEvent(event)

      expect(inputAssistantElem).toHaveTextContent('')
    })
  })

  describe('When input contains un-recommended words', () => {
    test('Should show input assistant message', () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true
      })

      inputElem.value = 'awesome-new-service'
      inputElem.dispatchEvent(event)

      expect(inputAssistantElem).toHaveTextContent(
        "Have a read of 'Naming your microservice best practice'"
      )
    })
  })
})
