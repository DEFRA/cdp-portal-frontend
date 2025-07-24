import { describe, expect, test } from 'vitest'
import { errorMessageHelper } from './error-message-helper.js'

describe('#errorMessage', () => {
  test('Should return null when no error message', () => {
    expect(errorMessageHelper('')).toBeNull()
  })

  test('Should return an error message object', () => {
    const text = 'Error message'
    const result = errorMessageHelper(text)

    expect(result).toEqual({
      attributes: {
        'data-js': 'app-error',
        tabindex: '-1'
      },
      text
    })
  })
})
