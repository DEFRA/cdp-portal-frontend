import { nullify404 } from '~/src/server/services/helpers/nullify-404'

const mock404Error = { message: 'Not Found', output: { statusCode: 404 } }
const mock500Error = { message: 'Holy smokes!', output: { statusCode: 50 } }

describe('#nullify404', () => {
  describe('When error is "404"', () => {
    test('Should provide "null"', async () => {
      expect(nullify404(mock404Error)).toBeNull()
    })
  })

  describe('When error is not "404"', () => {
    test('Should throw error', async () => {
      try {
        nullify404(mock500Error)
      } catch (error) {
        expect(error).toHaveProperty('message', 'Holy smokes!')
      }
    })
  })
})
