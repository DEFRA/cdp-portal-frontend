function errorMessages($form) {
  if (!$form) {
    return
  }

  const allowedInputs = ['select', 'input']

  const $formElements = Array.from($form.elements).filter((element) =>
    allowedInputs.includes(element.tagName.toLowerCase())
  )

  $formElements.forEach(($element) => {
    $element.addEventListener(
      'input',
      (event) => {
        const target = event.target
        const formGroup =
          target.closest('.app-form-group-js') ?? // Using a class as can't add attributes to GOVUK formGroup
          target.closest('[data-js="app-form-group"]')
        const errorMessage = formGroup.querySelector('[data-js="app-error"]')

        formGroup.classList.remove('govuk-form-group--error')
        $element.classList.remove('govuk-select--error', 'govuk-input--error')

        if (errorMessage) {
          errorMessage.remove()
        }
      },
      false
    )
  })
}

export { errorMessages }
