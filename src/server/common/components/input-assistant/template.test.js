import { renderTestComponent } from '~/test-helpers/component-helpers'

describe('Input assistant Component', () => {
  let $inputAssistant

  beforeEach(() => {
    $inputAssistant = renderTestComponent('input-assistant', {
      message: "Have a read of 'Naming your microservice best practice'",
      targetId: 'input-assistant'
    })('[data-testid="app-input-assistant"]').first()
  })

  test('Should render with expected attributes', () => {
    expect($inputAssistant.data('message')).toBe(
      "Have a read of 'Naming your microservice best practice'"
    )
    expect($inputAssistant.data('testid')).toBe('app-input-assistant')
  })
})
