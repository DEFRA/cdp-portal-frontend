import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Time Component', () => {
  let $time

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('Default datetime', () => {
    beforeEach(() => {
      $time = renderTestComponent('time', {
        params: {
          datetime: '2023-04-11T16:11:31.722Z'
        }
      })
    })

    test('Should render app time component', () => {
      expect($time('[data-testid="app-time"]')).toHaveLength(1)
    })

    test('Should contain expected rendered date', () => {
      expect($time('[data-testid="app-time"]').text().trim()).toBe(
        'Tue 11th Apr 2023 at 16:11'
      )
    })

    test('Should have expected datetime attribute', () => {
      expect($time('[data-testid="app-time"]').attr('datetime')).toBe(
        '2023-04-11T16:11:31.722Z'
      )
    })
  })

  describe('With seconds', () => {
    beforeEach(() => {
      $time = renderTestComponent('time', {
        params: {
          datetime: '2023-04-11T16:11:31.722Z',
          withSeconds: true
        }
      })
    })

    test('Should render app time component', () => {
      expect($time('[data-testid="app-time"]')).toHaveLength(1)
    })

    test('Should contain expected rendered date', () => {
      expect($time('[data-testid="app-time"]').text().trim()).toBe(
        'Tue 11th Apr 2023 at 16:11:31'
      )
    })

    test('Should have expected datetime attribute', () => {
      expect($time('[data-testid="app-time"]').attr('datetime')).toBe(
        '2023-04-11T16:11:31.722Z'
      )
    })
  })

  describe('With format string', () => {
    beforeEach(() => {
      $time = renderTestComponent('time', {
        params: {
          datetime: '2023-04-11T16:11:31.722Z',
          formatString: 'dd/MM/yyyy - HH:mm:ss'
        }
      })
    })

    test('Should render app time component', () => {
      expect($time('[data-testid="app-time"]')).toHaveLength(1)
    })

    test('Should contain expected rendered date', () => {
      expect($time('[data-testid="app-time"]').text().trim()).toBe(
        '11/04/2023 - 16:11:31'
      )
    })

    test('Should have expected datetime attribute', () => {
      expect($time('[data-testid="app-time"]').attr('datetime')).toBe(
        '2023-04-11T16:11:31.722Z'
      )
    })
  })
})
