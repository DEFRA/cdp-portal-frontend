import { buildOptions } from '~/src/server/common/helpers/build-options'

describe('#buildOptions', () => {
  describe('With simple items', () => {
    test('Should provide expected options', () => {
      expect(buildOptions(['0.1.0', '0.2.0'])).toEqual([
        {
          attributes: {
            selected: true
          },
          disabled: true,
          text: ' - - select - - ',
          value: ''
        },
        {
          text: '0.1.0',
          value: '0.1.0'
        },
        {
          text: '0.2.0',
          value: '0.2.0'
        }
      ])
    })
  })

  describe('With detailed items', () => {
    test('Should provide expected options', () => {
      expect(
        buildOptions([
          { text: 'Version 0.3.0', value: '0.3.0' },
          {
            text: 'Version 0.4.0',
            value: '0.4.0'
          }
        ])
      ).toEqual([
        {
          attributes: {
            selected: true
          },
          disabled: true,
          text: ' - - select - - ',
          value: ''
        },
        {
          text: 'Version 0.3.0',
          value: '0.3.0'
        },
        {
          text: 'Version 0.4.0',
          value: '0.4.0'
        }
      ])
    })
  })

  describe('Without blank option', () => {
    test('Should provide expected options', () => {
      expect(
        buildOptions(
          [
            { text: 'Version 0.3.0', value: '0.3.0' },
            {
              text: 'Version 0.4.0',
              value: '0.4.0'
            }
          ],
          false
        )
      ).toEqual([
        {
          text: 'Version 0.3.0',
          value: '0.3.0'
        },
        {
          text: 'Version 0.4.0',
          value: '0.4.0'
        }
      ])
    })
  })
})
