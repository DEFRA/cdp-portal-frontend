import { renderTestComponent } from '~/test-helpers/component-helpers.js'
import { button } from '~/src/server/common/components/button/button.js'

/**
 *  Helper to preventDefault for the form, and then fire the submit form event. ClientSide JavaScript reacts to the
 *  submit event and displays the loader. We wish to avoid actually submitting the form in these tests.
 * @param {HTMLFormElement}form
 */
const submitForm = (form) => {
  form.addEventListener('submit', (event) => event.preventDefault())
  form.submit()
}

describe('#button', () => {
  let buttonElem
  let buttonLoaderElem
  let mockForm

  beforeEach(() => {
    jest.useFakeTimers()

    const $component = renderTestComponent('button', {
      text: 'Press me!',
      loader: {
        name: 'button-loader'
      }
    })

    // Append button component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-form">
        ${$component.html()}
      </form>`

    // Init ClientSide JavaScript
    const buttons = Array.from(
      document.querySelectorAll('[data-js="app-button"]')
    )

    if (buttons.length) {
      buttons.forEach(button)
    }

    buttonElem = document.querySelector('[data-testid="app-button"]')
    buttonLoaderElem = document.querySelector('[data-testid="app-loader"]')
    mockForm = document.getElementById('mock-form')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('Should not disable button before specified delay', () => {
    submitForm(mockForm)
    jest.advanceTimersByTime(100)

    expect(buttonElem.getAttribute('disabled')).toBeNull()
  })

  test('Should not add loading class to loader before specified delay', () => {
    submitForm(mockForm)
    jest.advanceTimersByTime(100)

    expect(buttonElem.getAttribute('disabled')).toBeNull()
  })

  test('Should disable button on form submit after specified delay', () => {
    submitForm(mockForm)
    jest.advanceTimersByTime(200)

    expect(buttonElem.getAttribute('disabled')).toBe('disabled')
  })

  test('Should add loading class to loader on form submit after specified delay', () => {
    submitForm(mockForm)
    jest.advanceTimersByTime(200)

    expect(buttonLoaderElem.getAttribute('class')).toContain(
      'app-loader--is-loading'
    )
  })
})
