import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { button } from './button.js'

/**
 *  Helper to preventDefault for the form, and then fire the submit form event. ClientSide JavaScript reacts to the
 *  submit event and displays the loader. We wish to avoid actually submitting the form in these tests.
 * @param {HTMLFormElement}form
 */
const submitForm = (form) => {
  form.addEventListener('submit', (event) => event.preventDefault())

  form.dispatchEvent(
    new Event('submit', {
      bubbles: true,
      cancelable: true
    })
  )
}

describe('#button', () => {
  let $buttonElem, $buttonLoaderElem, $mockForm

  beforeEach(() => {
    vi.useFakeTimers()

    const $component = renderTestComponent('button', {
      params: {
        text: 'Press me!',
        loader: {
          name: 'button-loader'
        }
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

    $buttonElem = document.querySelector('[data-testid="app-button"]')
    $buttonLoaderElem = document.querySelector('[data-testid="app-loader"]')
    $mockForm = document.getElementById('mock-form')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should not disable button before specified delay', () => {
    submitForm($mockForm)
    vi.advanceTimersByTime(100)

    expect($buttonElem).toBeEnabled()
  })

  test('Should not add loading class to loader before specified delay', () => {
    submitForm($mockForm)
    vi.advanceTimersByTime(100)

    expect($buttonElem).toBeEnabled()
  })

  test('Should disable button on form submit after specified delay', () => {
    submitForm($mockForm)
    vi.advanceTimersByTime(200)

    expect($buttonElem).toHaveAttribute('disabled', 'disabled')
  })

  test('Should add loading class to loader on form submit after specified delay', () => {
    submitForm($mockForm)
    vi.advanceTimersByTime(200)

    expect($buttonLoaderElem).toHaveAttribute(
      'class',
      expect.stringContaining('app-loader--is-loading')
    )
  })
})
