import { calculateStepWidth } from '~/src/server/common/helpers/form/calculate-step-width'

describe('#calculateStepWidth', () => {
  test('With no complete steps, width should be zero', () => {
    expect(
      calculateStepWidth({
        one: false,
        two: false,
        three: false,
        four: false
      })
    ).toBe(0)
  })

  test('With 1 complete step, width should be a third', () => {
    expect(
      calculateStepWidth({
        one: true,
        two: false,
        three: false,
        four: false
      })
    ).toBe(33.333333333333336)
  })

  test('With 2 complete steps, width should be two thirds', () => {
    expect(
      calculateStepWidth({
        one: true,
        two: true,
        three: false,
        four: false
      })
    ).toBe(66.66666666666667)
  })

  test('With 3 complete steps, width should be full', () => {
    expect(
      calculateStepWidth({
        one: true,
        two: true,
        three: true,
        four: false
      })
    ).toBe(100)
  })

  test('With all complete steps, width should be full', () => {
    expect(
      calculateStepWidth({
        one: true,
        two: true,
        three: true,
        four: false
      })
    ).toBe(100)
  })
})
