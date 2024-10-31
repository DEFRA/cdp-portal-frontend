import { createHiddenInput } from '~/src/client/common/helpers/protect-form/create-hidden-input.js'

describe('#createHiddenInput', () => {
  let $element

  beforeEach(() => {
    $element = createHiddenInput('instanceCount', 40)
  })

  test('Should provide expected input name', () => {
    expect($element.name).toBe('instanceCount')
  })

  test('Should provide expected input value', () => {
    expect($element.value).toBe('40')
  })

  test('Should provide expected input id', () => {
    expect($element.id).toBe('instanceCount-protected-hidden')
  })

  test('Should provide expected input type', () => {
    expect($element.type).toBe('hidden')
  })

  test('Should provide expected input', () => {
    expect($element.tagName.toLowerCase()).toBe('input')
  })
})
