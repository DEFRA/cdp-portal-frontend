const pressEnter = (input) =>
  input.dispatchEvent(
    new KeyboardEvent('keydown', {
      code: 'enter'
    })
  )

const enterValue = (input, value) => {
  input.focus()
  input.value = value
  input.dispatchEvent(new Event('input'))
}

export { pressEnter, enterValue }
