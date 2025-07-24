import { describe, expect, test } from 'vitest'
import { nullify404 } from './nullify-404.js'
import {
  getErrorSync,
  NoErrorThrownError
} from '../../../../test-helpers/get-error.js'

const mock404Error = { message: 'Not Found', output: { statusCode: 404 } }
const mock500Error = { message: 'Holy smokes!', output: { statusCode: 50 } }

describe('#nullify404', () => {
  describe('When error is "404"', () => {
    test('Should provide "null"', () => {
      expect(nullify404(mock404Error)).toBeNull()
    })
  })

  describe('When error is not "404"', () => {
    test('Should throw error', () => {
      const error = getErrorSync(() => nullify404(mock500Error))

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toHaveProperty('message', 'Holy smokes!')
    })
  })
})
