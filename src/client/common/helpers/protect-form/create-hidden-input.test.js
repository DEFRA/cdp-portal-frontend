import { createHiddenInput } from '~/src/client/common/helpers/protect-form/create-hidden-input'

describe('#createHiddenInput', () => {
  let $element

  beforeEach(() => {
    $element = createHiddenInput('instanceCount', 40)
  })

  test('Should provide expected input name', () => {
    expect($element.name).toEqual('instanceCount')
  })

  test('Should provide expected input value', () => {
    expect($element.value).toEqual('40')
  })

  test('Should provide expected input id', () => {
    expect($element.id).toEqual('instanceCount-protected-hidden')
  })

  test('Should provide expected input type', () => {
    expect($element.type).toEqual('hidden')
  })

  test('Should provide expected input', () => {
    expect($element.tagName.toLowerCase()).toEqual('input')
  })
})
