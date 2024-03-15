import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Time Component', () => {
  let $time

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    $time = renderTestComponent('time', {
      datetime: '2023-04-11T16:11:31.722Z'
    })
  })

  test('Should render app time component', () => {
    expect($time('[data-testid="app-time"]').length).toEqual(1)
  })

  test('Should contain expected rendered date', () => {
    expect($time('[data-testid="app-time"]').text().trim()).toEqual(
      'Tue 11th Apr 2023 at 16:11'
    )
  })

  test('Should have expected datetime attribute', () => {
    expect($time('[data-testid="app-time"]').attr('datetime')).toEqual(
      '2023-04-11T16:11:31.722Z'
    )
  })
})
