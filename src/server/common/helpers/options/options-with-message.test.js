import { optionsWithMessage } from './options-with-message.js'

describe('#optionsWithMessage', () => {
  test('Should provide expected options', () => {
    expect(optionsWithMessage('What a glorious day!')).toEqual([
      {
        attributes: {
          selected: true
        },
        disabled: true,
        text: ' - - What a glorious day! - - ',
        value: ''
      }
    ])
  })
})
