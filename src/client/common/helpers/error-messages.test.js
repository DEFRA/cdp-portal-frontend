import { errorMessages } from '~/src/client/common/helpers/error-messages'

describe('#errorMessages', () => {
  let input
  let select

  beforeEach(() => {
    // Add mock form to document
    document.body.innerHTML = `
      <form data-js="mock-form-errors" data-testid="mock-form-errors">
        <div class="app-form-group-js" data-testid="form-group-image-name">
          <p data-js="app-error">
            Enter a value
          </p>

          <input type="text" name="imageName" value="cdp-portal-frontend" data-testid="image-name" />
        </div>

        <div class="app-form-group-js" data-testid="form-group-instance-count">
          <p data-js="app-error">
            Choose an entry
          </p>

          <select name="instanceCount" data-testid="instance-count">
            <option value="" selected="selected"> -- Select option -- </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <button>Send</button>
      </form>`

    // Init ClientSide JavaScript
    const errorForms = Array.from(
      document.querySelectorAll('[data-js="mock-form-errors"]')
    )

    if (errorForms.length) {
      errorForms.forEach((form) => errorMessages(form))
    }

    input = document.querySelector('[data-testid="image-name"]')
    select = document.querySelector('[data-testid="instance-count"]')
  })

  describe('Text input with error', () => {
    beforeEach(() => {
      input.focus()
      input.value = 'cdp-portal-frontend'
      input.dispatchEvent(new Event('change'))
    })

    test('On input change should remove its server side error', () => {
      const inputFormGroup = document.querySelector(
        '[data-testid="form-group-image-name"]'
      )
      const errors = inputFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(0)
    })

    test('Other form group errors should remain', () => {
      const selectFormGroup = document.querySelector(
        '[data-testid="form-group-instance-count"]'
      )
      const errors = selectFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(1)
      expect(errors[0].textContent.trim()).toEqual('Choose an entry')
    })
  })

  describe('Select input with error', () => {
    beforeEach(() => {
      select.focus()
      select.value = '1'
      select.dispatchEvent(new Event('change'))
    })

    test('On select change should remove server side error', () => {
      const selectFormGroup = document.querySelector(
        '[data-testid="form-group-instance-count"]'
      )
      const errors = selectFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(0)
    })

    test('Other form group errors should remain', () => {
      const inputFormGroup = document.querySelector(
        '[data-testid="form-group-image-name"]'
      )
      const errors = inputFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(1)
      expect(errors[0].textContent.trim()).toEqual('Enter a value')
    })
  })
})
