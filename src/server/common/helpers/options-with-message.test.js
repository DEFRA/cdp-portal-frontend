import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'

describe('#optionsWithMessage', () => {
  test('Should provide expected options', () => {
    expect(optionsWithMessage('What a glorious day!')).toEqual([
      {
        attributes: {
          hidden: true
        }
      },
      {
        attributes: {
          disabled: true
        },
        text: 'What a glorious day!',
        value: ''
      }
    ])
  })
})
