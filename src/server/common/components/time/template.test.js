import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest'
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

  beforeEach(() => {
    $time = renderTestComponent('time', {
      datetime: '2023-04-11T16:11:31.722Z'
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
