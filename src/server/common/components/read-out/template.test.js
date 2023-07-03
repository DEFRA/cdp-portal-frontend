import { renderComponent } from '~/test-helpers/component-helpers'

describe('Read Out Component', () => {
  let $readout

  beforeEach(() => {
    $readout = renderComponent('read-out', {
      description: 'Your repository name will be',
      targetId: 'mock-target-id'
    })('[data-testid="app-read-out"]').first()
  })

  test('Should render with expected description', () => {
    expect($readout.find('span').first().text()).toContain(
      'Your repository name will be'
    )
  })

  test('Should render with expected target id', () => {
    expect($readout.find('span:eq(1)').attr('id')).toEqual('mock-target-id')
  })
})
