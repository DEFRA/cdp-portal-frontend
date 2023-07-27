function createHiddenInput(name, value) {
  const $input = document.createElement('input')

  $input.setAttribute('type', 'hidden')
  $input.setAttribute('id', `${name}-protected-hidden`)
  $input.setAttribute('name', name)
  $input.setAttribute('value', value)

  return $input
}

export { createHiddenInput }
