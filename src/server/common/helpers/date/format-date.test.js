import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { formatDate } from './format-date.js'

describe('#formatDate', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('With defaults', () => {
    test('Date should be in expected format', () => {
      expect(formatDate('2022-01-17T11:40:02.242Z')).toBe(
        'Monday 17th January 2022, 11:40:02'
      )
    })
  })

  describe('With format attribute', () => {
    test('Date should be in provided format', () => {
      expect(formatDate('2022-01-17T11:40:02.242Z', 'EEEE do MMMM yyyy')).toBe(
        'Monday 17th January 2022'
      )
    })
  })

  describe('With no value', () => {
    test('Result should be undefined', () => {
      expect(formatDate()).toBeUndefined()
    })
  })
})
