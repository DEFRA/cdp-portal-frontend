import { renderComponent } from '~/test-helpers/component-helpers'
import { button } from '~/src/server/common/components/button/button'

describe('#button', () => {
  let buttonElem
  let buttonLoaderElem

  beforeEach(() => {
    jest.useFakeTimers()

    const $component = renderComponent('button', {
      text: 'Press me!',
      loader: {
        name: 'button-loader'
      }
    })

    // Append button component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-form">
        ${$component('[data-testid="app-button-container"]').first().html()}
      </form>`

    // Init ClientSide JavaScript
    const $buttons = Array.from(
      document.querySelectorAll('[data-js="app-button"]')
    )

    if ($buttons.length) {
      $buttons.forEach(($button) => button($button))
    }

    buttonElem = document.querySelector('[data-testid="app-button"]')
    buttonLoaderElem = document.querySelector('[data-testid="app-loader"]')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('Should not disable button before specified delay', () => {
    document.getElementById('mock-form').submit()

    jest.advanceTimersByTime(100)

    expect(buttonElem.getAttribute('disabled')).toBeNull()
  })

  test('Should not add loading class to loader before specified delay', () => {
    document.getElementById('mock-form').submit()

    jest.advanceTimersByTime(100)

    expect(buttonElem.getAttribute('disabled')).toBeNull()
  })

  test('Should disable button on form submit after specified delay', () => {
    document.getElementById('mock-form').submit()

    jest.advanceTimersByTime(200)

    expect(buttonElem.getAttribute('disabled')).toEqual('disabled')
  })

  test('Should add loading class to loader on form submit after specified delay', () => {
    document.getElementById('mock-form').submit()

    jest.advanceTimersByTime(200)

    expect(buttonLoaderElem.getAttribute('class')).toContain(
      'app-loader--is-loading'
    )
  })
})
