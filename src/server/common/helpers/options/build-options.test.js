import { buildOptions } from './build-options.js'

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

    test('Should provide expected options with html', () => {
      expect(
        buildOptions([
          { html: '<em>Version 0.6.0</em>', value: '0.6.0' },
          {
            html: '<em>Version 0.7.0</em>',
            value: '0.7.0'
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
          html: '<em>Version 0.6.0</em>',
          value: '0.6.0'
        },
        {
          html: '<em>Version 0.7.0</em>',
          value: '0.7.0'
        }
      ])
    })
  })
})
