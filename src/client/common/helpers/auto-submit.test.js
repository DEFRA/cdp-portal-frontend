import { xhrRequest } from '~/src/client/common/helpers/xhr'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'

jest.mock('~/src/client/common/helpers/xhr')

describe('#autoSubmit', () => {
  let form
  let input

  beforeEach(() => {
    jest.useFakeTimers()

    // Add auto submit form to the document
    document.body.innerHTML = `<form data-js="auto-submit" data-testid="auto-submit" action="/mock-action">
        <input type="text" data-testid="auto-submit-input" name="weather" />
        <select name="temperature" data-testid="auto-submit-select">
          <option value="" selected="selected"> -- Select option -- </option>
          <option value="10c">10c</option>
          <option value="20c">20c</option>
          <option value="30c">30c</option>
        </select>
      </form>`

    // Init ClientSide JavaScript
    const autoSubmitForms = Array.from(
      document.querySelectorAll('[data-js="auto-submit"]')
    )

    if (autoSubmitForms.length) {
      autoSubmitForms.forEach((form) => autoSubmit(form))
    }

    form = document.querySelector('[data-testid="auto-submit"]')
    input = document.querySelector('[data-testid="auto-submit-input"]')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('When value entered into input', () => {
    beforeEach(async () => {
      input.focus()
      input.value = 'sunshine'

      form.dispatchEvent(new Event('input'))

      jest.advanceTimersByTime(310)
    })

    test('Should submit form', () => {
      expect(xhrRequest).toHaveBeenCalledWith('http://localhost/mock-action', {
        weather: 'sunshine'
      })
    })
  })

  describe('When value submitted', () => {
    beforeEach(async () => {
      input.focus()
      input.value = 'snow'

      form.dispatchEvent(new Event('submit'))
    })

    test('Should submit form', () => {
      expect(xhrRequest).toHaveBeenCalledWith('http://localhost/mock-action', {
        weather: 'snow'
      })
    })
  })
})
