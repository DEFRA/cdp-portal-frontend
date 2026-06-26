import { normaliseEnvironments } from './make-notification-controllers.js'

describe('#normaliseEnvironments', () => {
  describe('When environments is a string (single checkbox submitted by HTML form)', () => {
    test('Should return a one-element array', () => {
      expect(normaliseEnvironments('infra-dev')).toEqual(['infra-dev'])
    })

    test('Should not cause substring matches — "infra-dev" must not imply "dev"', () => {
      const result = normaliseEnvironments('infra-dev')
      expect(result.includes('dev')).toBe(false)
      expect(result.includes('infra-dev')).toBe(true)
    })
  })

  describe('When environments is already an array (multiple checkboxes)', () => {
    test('Should return the array unchanged', () => {
      expect(normaliseEnvironments(['infra-dev', 'dev'])).toEqual([
        'infra-dev',
        'dev'
      ])
    })
  })

  describe('When environments is undefined (no checkbox checked)', () => {
    test('Should return an empty array', () => {
      expect(normaliseEnvironments(undefined)).toEqual([])
    })
  })
})
