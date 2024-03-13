import { relativeDate } from '~/src/server/common/helpers/date/relative-date'

describe('#relativeDate', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2024-06-28T14:16:00.000Z')) // Fri Jun 25 2024 15:16:00 GMT+0100 (British Summer Time)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('When date is today', () => {
    test('Should provide message for the last minute', () => {
      expect(relativeDate('2024-06-28T14:15:45.000Z')).toEqual(
        'In the last minute at 14:15'
      )
    })

    test('Should provide message in the last 5 minutes', () => {
      expect(relativeDate('2024-06-28T14:15:00.000Z')).toEqual(
        'Just now at 14:15'
      )
    })

    test('Should provide message in the last 20 minutes', () => {
      expect(relativeDate('2024-06-28T14:00:00.000Z')).toEqual(
        'A few minutes ago at 14:00'
      )
    })

    test('Should provide message in the last 30 minutes', () => {
      expect(relativeDate('2024-06-28T13:51:00.000Z')).toEqual(
        'A little while ago at 13:51'
      )
    })

    test('Should provide message in the last 60 minutes', () => {
      expect(relativeDate('2024-06-28T13:17:00.000Z')).toEqual(
        'Within the hour at 13:17'
      )
    })

    test('Should provide message over an hour ago', () => {
      expect(relativeDate('2024-06-28T13:01:00.000Z')).toEqual(
        'About an hour ago at 13:01'
      )
    })

    test('Should provide message for a few hours ago', () => {
      expect(relativeDate('2024-06-28T09:01:00.000Z')).toEqual(
        'A few hours ago at 09:01'
      )
    })

    test('Should provide message for earlier today', () => {
      expect(relativeDate('2024-06-28T04:01:00.000Z')).toEqual(
        'Earlier today at 04:01'
      )
    })

    test('Should provide message for earlier today', () => {
      expect(relativeDate('2024-06-28T02:01:00.000Z')).toEqual('Today at 02:01')
    })
  })

  describe('When a date was yesterday', () => {
    test('Should provide message for yesterday', () => {
      expect(relativeDate('2024-06-27T14:15:45.000Z')).toEqual(
        'Yesterday at 14:15'
      )
    })
  })

  describe('When a date was earlier in the week', () => {
    test('Should provide message for last Tuesday', () => {
      expect(relativeDate('2024-06-25T14:15:45.000Z')).toEqual(
        'Last Tuesday at 14:15'
      )
    })

    test('Should provide message for last Sunday', () => {
      expect(relativeDate('2024-06-23T14:15:45.000Z')).toEqual(
        'Last Sunday at 14:15'
      )
    })
  })

  describe('When a date was a couple of weeks ago', () => {
    test('Should provide message for earlier in the month', () => {
      expect(relativeDate('2024-06-07T14:15:45.000Z')).toEqual(
        'Fri 7th Jun 2024 at 14:15'
      )
    })
  })

  describe('With seconds', () => {
    test('Should provide message for earlier in the month with seconds', () => {
      expect(relativeDate('2024-06-07T14:15:45.000Z', true)).toEqual(
        'Fri 7th Jun 2024 at 14:15:45'
      )
    })
  })
})
