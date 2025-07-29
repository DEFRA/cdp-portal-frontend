import { relativeDate } from './relative-date.js'

describe('#relativeDate', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-28T14:16:00.000Z')) // Fri Jun 25 2024 15:16:00 GMT+0100 (British Summer Time)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('When date is today', () => {
    test('Should provide message for earlier today', () => {
      expect(relativeDate('2024-06-28T02:01:00.000Z')).toBe('Today at 02:01')
    })
  })

  describe('When a date was yesterday', () => {
    test('Should provide message for yesterday', () => {
      expect(relativeDate('2024-06-27T14:15:45.000Z')).toBe(
        'Yesterday at 14:15'
      )
    })
  })

  describe('When a date was earlier in the week', () => {
    test('Should provide message for last Tuesday', () => {
      expect(relativeDate('2024-06-25T14:15:45.000Z')).toBe(
        'Last Tuesday at 14:15'
      )
    })

    test('Should provide message for last Sunday', () => {
      expect(relativeDate('2024-06-23T14:15:45.000Z')).toBe(
        'Last Sunday at 14:15'
      )
    })
  })

  describe('When a date was a couple of weeks ago', () => {
    test('Should provide message for earlier in the month', () => {
      expect(relativeDate('2024-06-07T14:15:45.000Z')).toBe(
        'Fri 7th Jun 2024 at 14:15'
      )
    })
  })

  describe('With seconds', () => {
    test('Should provide message for earlier in the month with seconds', () => {
      expect(relativeDate('2024-06-07T14:15:45.000Z', true)).toBe(
        'Fri 7th Jun 2024 at 14:15:45'
      )
    })
  })

  describe('With no value', () => {
    test('Result should be undefined', () => {
      expect(relativeDate()).toBeUndefined()
    })
  })
})
