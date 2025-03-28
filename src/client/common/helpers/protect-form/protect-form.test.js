import { protectForm } from '~/src/client/common/helpers/protect-form/protect-form.js'
import { dispatchDomContentLoaded } from '~/test-helpers/dispatch-dom-content-loaded.js'

describe('#protectForm', () => {
  let form
  let editButton
  let selectInput

  beforeEach(() => {
    // Add form, edit button and protected inputs to dom
    document.body.innerHTML = `<form data-js="app-protected-inputs">
        <button type="submit" class="js-visible" data-testid="edit-button" data-js="protected-button">
          Edit
        </button>
        <select name="instanceCount" data-testid="instance-count">
          <option value="" disabled="" selected="true"> - - select - - </option>
          <option value="1" selected="">1</option>
          <option value="2">2</option>
        </select>
      </form>`.trim()

    // Init ClientSide JavaScript
    form = Array.from(
      document.querySelectorAll('[data-js="app-protected-inputs"]')
    ).at(0)
    protectForm(form)

    editButton = document.querySelector('[data-testid="edit-button"]')
    selectInput = document.querySelector('[data-testid="instance-count"]')

    dispatchDomContentLoaded()
  })

  describe('On document load', () => {
    test('Form should have expected protect attribute', () => {
      expect(form.dataset.protect).toBe('true')
    })

    test('Inputs should be disabled', () => {
      expect(selectInput.getAttribute('disabled')).toBe('disabled')
    })

    test('Expected hidden input should have been created', () => {
      const hiddenInput = document.getElementById(
        'instanceCount-protected-hidden'
      )

      expect(hiddenInput.id).toBe('instanceCount-protected-hidden')
      expect(hiddenInput.name).toBe('instanceCount')
      expect(hiddenInput.value).toBe('1')
    })
  })

  describe('On edit button click', () => {
    test('Form should have expected protect attribute', () => {
      editButton.click()

      expect(form.dataset.protect).toBe('false')
    })

    test('Inputs should not be disabled', () => {
      editButton.click()

      expect(selectInput.getAttribute('disabled')).toBeNull()
    })

    test('Expected hidden input should not have been created', () => {
      editButton.click()

      const hiddenInput = document.getElementById(
        'instanceCount-protected-hidden'
      )

      expect(hiddenInput).toBeNull()
    })
  })
})
