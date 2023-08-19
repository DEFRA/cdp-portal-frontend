import { errorMessages } from '~/src/client/common/helpers/error-messages'

describe('#errorMessages', () => {
  let input
  let select

  beforeEach(() => {
    // Add mock form to document
    document.body.innerHTML = `
      <form data-js="mock-form-errors" data-testid="mock-form-errors">
        <div class="govuk-form-group--error app-form-group-js" data-testid="form-group-image-name">
          <p data-js="app-error">
            Enter a value
          </p>

          <input class="govuk-input--error" type="text" name="imageName" value="cdp-portal-frontend" data-testid="image-name" />
        </div>

        <div class="govuk-form-group--error app-form-group-js" data-testid="form-group-instance-count">
          <p data-js="app-error">
            Choose an entry
          </p>

          <select class="govuk-select--error" name="instanceCount" data-testid="instance-count">
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
      input.dispatchEvent(new Event('input'))
    })

    test('On input event should remove its server side error', () => {
      const inputFormGroup = document.querySelector(
        '[data-testid="form-group-image-name"]'
      )
      const errors = inputFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(0)
      expect(inputFormGroup.className).toEqual('app-form-group-js')
      expect(input.className).toEqual('')
    })

    test('Other form group errors should remain', () => {
      const selectFormGroup = document.querySelector(
        '[data-testid="form-group-instance-count"]'
      )
      const errors = selectFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(1)
      expect(errors[0].textContent.trim()).toEqual('Choose an entry')
      expect(selectFormGroup.className).toEqual(
        'govuk-form-group--error app-form-group-js'
      )
      expect(select.className).toEqual('govuk-select--error')
    })
  })

  describe('Select input with error', () => {
    beforeEach(() => {
      select.focus()
      select.value = '1'
      select.dispatchEvent(new Event('input'))
    })

    test('On select input event should remove server side error', () => {
      const selectFormGroup = document.querySelector(
        '[data-testid="form-group-instance-count"]'
      )
      const errors = selectFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(0)
      expect(selectFormGroup.className).toEqual('app-form-group-js')
      expect(select.className).toEqual('')
    })

    test('Other form group errors should remain', () => {
      const inputFormGroup = document.querySelector(
        '[data-testid="form-group-image-name"]'
      )
      const errors = inputFormGroup.querySelectorAll('[data-js="app-error"]')

      expect(errors.length).toEqual(1)
      expect(errors[0].textContent.trim()).toEqual('Enter a value')
      expect(inputFormGroup.className).toEqual(
        'govuk-form-group--error app-form-group-js'
      )
      expect(input.className).toEqual('govuk-input--error')
    })
  })
})
