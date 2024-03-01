import { toggleProtectedInputs } from '~/src/client/common/helpers/protect-form/toggle-protected-inputs'

const getProtectedInputs = (form) =>
  Array.from(form.elements).filter(
    (element) => element.tagName.toLowerCase() === 'select'
  )

describe('#toggleProtectedInputs', () => {
  let selectInput
  let form

  beforeEach(() => {
    // Add form and protected inputs to dom
    document.body.innerHTML = `<form data-js="app-protected-inputs">
        <select name="instanceCount" data-testid="instance-count">
          <option value="" disabled="" selected="true"> - - select - - </option>
          <option value="1" selected="">1</option>
          <option value="2">2</option>
        </select>
      </form>`.trim()

    form = Array.from(
      document.querySelectorAll('[data-js="app-protected-inputs"]')
    ).at(0)
    selectInput = document.querySelector('[data-testid="instance-count"]')
  })

  describe('When inputs are protected', () => {
    beforeEach(() => {
      // Init ClientSide JavaScript
      toggleProtectedInputs(form, getProtectedInputs(form), true)
    })

    test('Form should have expected protect attribute', () => {
      expect(form.dataset.protect).toEqual('true')
    })

    test('Inputs should be disabled', () => {
      expect(selectInput.getAttribute('disabled')).toEqual('disabled')
    })

    test('Expected hidden input should have been created', () => {
      const hiddenInput = document.getElementById(
        'instanceCount-protected-hidden'
      )

      expect(hiddenInput.id).toEqual('instanceCount-protected-hidden')
      expect(hiddenInput.name).toEqual('instanceCount')
      expect(hiddenInput.value).toEqual('1')
    })
  })

  describe('When inputs are not protected', () => {
    beforeEach(() => {
      // Init ClientSide JavaScript
      toggleProtectedInputs(form, getProtectedInputs(form), false)
    })

    test('Form should have expected protect attribute', () => {
      expect(form.dataset.protect).toEqual('false')
    })

    test('Inputs should not be disabled', () => {
      expect(selectInput.getAttribute('disabled')).toBeNull()
    })

    test('Expected hidden input should not have been created', () => {
      const hiddenInput = document.getElementById(
        'instanceCount-protected-hidden'
      )

      expect(hiddenInput).toBeNull()
    })
  })
})
