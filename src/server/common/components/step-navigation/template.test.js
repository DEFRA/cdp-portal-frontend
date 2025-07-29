import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('StepNavigation', () => {
  let $component, $stepNavigation

  beforeEach(() => {
    $component = renderTestComponent('step-navigation', {
      params: {
        classes: 'app-step-navigation--slim',
        width: 100,
        steps: [
          {
            text: 'Step 1',
            isCurrent: false,
            isComplete: true,
            url: '/step-1'
          },
          { text: 'Step 2', isCurrent: true },
          { text: 'Step 3', isCurrent: false }
        ]
      }
    })
    $stepNavigation = $component('[data-testid="app-step-navigation"]')
  })

  test('Should render with expected css classes', () => {
    expect(
      $component('[data-testid="app-step-navigation__container"]').attr('class')
    ).toEqual('app-step-navigation-container app-step-navigation--slim')
  })

  test('Should render all steps with correct text and attributes', () => {
    const $firstLi = $stepNavigation.find('li').eq(0)
    const $firstAnchor = $firstLi.find('a')
    const $firstText = $firstLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $firstMarker = $firstLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    const $secondLi = $stepNavigation.find('li').eq(1)
    const $secondAnchor = $secondLi.find('a')
    const $secondText = $secondLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $secondMarker = $secondLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    const $thirdLi = $stepNavigation.find('li').eq(2)
    const $thirdAnchor = $thirdLi.find('a')
    const $thirdText = $thirdLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $thirdMarker = $thirdLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    expect($firstLi.attr('class')).toEqual('app-step-navigation__item')
    expect($firstLi.attr('aria-current')).toBeUndefined()
    expect($firstAnchor.attr('href')).toEqual('/step-1')
    expect($firstText.text()).toContain('Step 1')
    expect($firstMarker.attr('class')).toEqual(
      'app-step-navigation__point app-step-navigation__point--complete'
    )

    expect($secondLi.attr('class')).toEqual(
      'app-step-navigation__item app-step-navigation__item--current'
    )
    expect($secondLi.attr('aria-current')).toEqual('step')
    expect($secondAnchor).toHaveLength(0) // No link for current step
    expect($secondText.text()).toContain('Step 2')
    expect($secondMarker.attr('class')).toEqual(
      'app-step-navigation__point app-step-navigation__point--current'
    )

    expect($thirdLi.attr('class')).toEqual('app-step-navigation__item')
    expect($thirdLi.attr('aria-current')).toBeUndefined()
    expect($thirdAnchor).toHaveLength(0) // No link for yet to be reached step
    expect($thirdText.text()).toContain('Step 3')
    expect($thirdMarker.attr('class')).toEqual('app-step-navigation__point')
  })

  test('Should apply correct styles and text for current step', () => {
    const $secondLi = $stepNavigation.find('li').eq(1)
    const $secondAnchor = $secondLi.find('a')
    const $secondText = $secondLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $secondMarker = $secondLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    expect($secondLi.attr('class')).toEqual(
      'app-step-navigation__item app-step-navigation__item--current'
    )
    expect($secondLi.attr('aria-current')).toEqual('step')
    expect($secondAnchor).toHaveLength(0) // No link for current step
    expect($secondText.text()).toContain('Step 2')
    expect($secondMarker.attr('class')).toEqual(
      'app-step-navigation__point app-step-navigation__point--current'
    )
  })

  test('Should apply correct styles and text for completed step', () => {
    const $firstLi = $stepNavigation.find('li').eq(0)
    const $firstAnchor = $firstLi.find('a')
    const $firstText = $firstLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $firstMarker = $firstLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    expect($firstLi.attr('class')).toEqual('app-step-navigation__item')
    expect($firstLi.attr('aria-current')).toBeUndefined()
    expect($firstAnchor.attr('href')).toEqual('/step-1')
    expect($firstText.text()).toContain('Step 1')
    expect($firstMarker.attr('class')).toEqual(
      'app-step-navigation__point app-step-navigation__point--complete'
    )
  })

  test('Should apply correct styles and text for incomplete step', () => {
    const $thirdLi = $stepNavigation.find('li').eq(2)
    const $thirdAnchor = $thirdLi.find('a')
    const $thirdText = $thirdLi.find(
      '[data-testid="app-step-navigation__text"]'
    )
    const $thirdMarker = $thirdLi.find(
      '[data-testid="app-step-navigation__marker"]'
    )

    expect($thirdLi.attr('class')).toEqual('app-step-navigation__item')
    expect($thirdLi.attr('aria-current')).toBeUndefined()
    expect($thirdAnchor).toHaveLength(0) // No link for current step
    expect($thirdText.text()).toContain('Step 3')
    expect($thirdMarker.attr('class')).toEqual('app-step-navigation__point')
  })

  test('Should not render a link for incomplete or current steps', () => {
    const $secondLi = $stepNavigation.find('li').eq(1)
    const $secondAnchor = $secondLi.find('a')

    const $thirdLi = $stepNavigation.find('li').eq(2)
    const $thirdAnchor = $thirdLi.find('a')

    expect($secondAnchor).toHaveLength(0) // No link for current step
    expect($thirdAnchor).toHaveLength(0) // No link for yet to be reached step
  })
})
