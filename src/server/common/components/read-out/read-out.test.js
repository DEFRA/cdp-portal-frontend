import { renderComponent } from '~/test-helpers/component-helpers'
import { readOut } from '~/src/server/common/components/read-out/read-out'

describe('#readOut', () => {
  let inputElem
  let readoutElem

  beforeEach(() => {
    jest.useFakeTimers()

    const $component = renderComponent('read-out', {
      description: 'Your repository name will be',
      targetId: 'test-target-id'
    })

    // Add component with companion input
    document.body.innerHTML = `<div>
        <input type="text" data-js="test-input" data-target-id="test-target-id" data-testid="app-input" />  
        ${$component('[data-testid="app-read-out"]').first().html()}
      </div>`

    // Init ClientSide JavaScript
    const $readOutInputs = Array.from(
      document.querySelectorAll('[data-js="test-input"]')
    )

    if ($readOutInputs.length) {
      $readOutInputs.forEach(($readOutInput) => readOut($readOutInput))
    }

    inputElem = document.querySelector('[data-testid="app-input"]')
    readoutElem = document.querySelector('#test-target-id')
  })

  test('Should display input value in readout elem', () => {
    const event = new Event('input', {
      bubbles: true,
      cancelable: true
    })

    inputElem.value = 'hello there!'
    inputElem.dispatchEvent(event)

    expect(readoutElem.textContent).toEqual('hello-there')
  })
})
