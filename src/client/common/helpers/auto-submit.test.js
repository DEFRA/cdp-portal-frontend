import { xhrRequest } from '~/src/client/common/helpers/xhr.js'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit.js'

jest.mock('~/src/client/common/helpers/xhr')

describe('#autoSubmit', () => {
  describe('Default behaviour', () => {
    let form
    let input
    let xhrElementInput

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
         <article data-xhr>
           <input type="text" data-testid="xhr-dogs" name="dogs" />
         </article>
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
      xhrElementInput = document.querySelector('[data-testid="xhr-dogs"]')
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    describe('When value entered into input', () => {
      beforeEach(() => {
        input.focus()
        input.value = 'sunshine'

        form.dispatchEvent(new Event('input'))

        jest.advanceTimersByTime(310)
      })

      test('Should submit form', () => {
        expect(xhrRequest).toHaveBeenCalledWith(
          'http://localhost/mock-action',
          {
            weather: 'sunshine'
          }
        )
      })
    })

    describe('When value submitted', () => {
      beforeEach(() => {
        input.focus()
        input.value = 'snow'

        form.dispatchEvent(new Event('submit'))
      })

      test('Should submit form', () => {
        expect(xhrRequest).toHaveBeenCalledWith(
          'http://localhost/mock-action',
          {
            weather: 'snow'
          }
        )
      })
    })

    describe('When input inside of xhr element is interacted with', () => {
      beforeEach(() => {
        xhrElementInput.focus()
        xhrElementInput.value = 'scooby'
        xhrElementInput.dispatchEvent(new Event('input', { bubbles: true }))

        jest.advanceTimersByTime(310)
      })

      test('Should not submit form', () => {
        expect(xhrRequest).not.toHaveBeenCalled()
      })
    })
  })

  describe('With "childrenCanSubmit" bypass', () => {
    let childrenCanSubmitElementInput

    beforeEach(() => {
      jest.useFakeTimers()

      // Add auto submit form to the document
      document.body.innerHTML = `<form data-js="auto-submit-with-bypass" data-testid="auto-submit-with-bypass" action="/mock-action-with-bypass">
         <article data-xhr data-children-can-submit="true">
           <input type="text" data-testid="xhr-cats" name="cats" />
         </article>
       </form>`

      // Init ClientSide JavaScript
      const autoSubmitForms = Array.from(
        document.querySelectorAll('[data-js="auto-submit-with-bypass"]')
      )

      if (autoSubmitForms.length) {
        autoSubmitForms.forEach((form) => autoSubmit(form))
      }

      childrenCanSubmitElementInput = document.querySelector(
        '[data-testid="xhr-cats"]'
      )
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    describe('When input inside of xhr element is interacted with', () => {
      beforeEach(() => {
        childrenCanSubmitElementInput.focus()
        childrenCanSubmitElementInput.value = 'garfield'
        childrenCanSubmitElementInput.dispatchEvent(
          new Event('input', { bubbles: true })
        )

        jest.advanceTimersByTime(310)
      })

      test('Should not submit form', () => {
        expect(xhrRequest).toHaveBeenCalledWith(
          'http://localhost/mock-action-with-bypass',
          {
            cats: 'garfield'
          }
        )
      })
    })
  })
})
