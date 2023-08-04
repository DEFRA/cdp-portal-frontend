import { formItemsToObject } from '~/src/client/common/helpers/form-items-to-object'

describe('#formItemsToObject', () => {
  beforeEach(() => {
    // Add mock form to document
    document.body.innerHTML = `
      <form id="mock-form-items">
        <input type="text" name="inputOne" value="awesome">
        <input type="text" name="inputTwo" value="weather">
        <select name="inputThree">
          <option value="in"></option>
          <option value="the" selected="selected"></option>
          <option value="summer"></option>
        </select>
        <input type="hidden" name="inputFour" value="">
        <button>Send</button>
      </form>`
  })

  test('Should provide expected object', () => {
    const $form = document.getElementById('mock-form-items')

    expect(formItemsToObject($form.elements)).toEqual({
      inputOne: 'awesome',
      inputThree: 'the',
      inputTwo: 'weather'
    })
  })
})
