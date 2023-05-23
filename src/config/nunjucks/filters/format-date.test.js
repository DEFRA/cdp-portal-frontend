import { formatDate } from '~/src/config/nunjucks/filters/format-date'

describe('#formatDate', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('With defaults', () => {
    test('Date should be in expected format', () => {
      expect(formatDate('2022-01-17T11:40:02.242Z')).toEqual(
        '11:40 am on Mon 17th January 2022'
      )
    })
  })

  describe('With format attribute', () => {
    test('Date should be in provided format', () => {
      expect(
        formatDate('2022-01-17T11:40:02.242Z', 'EEEE do MMMM yyyy')
      ).toEqual('Monday 17th January 2022')
    })
  })
})
