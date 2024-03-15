function errorMessages($form) {
  if (!$form) {
    return
  }

  const allowedInputs = ['select', 'input', 'textarea']

  $form.addEventListener(
    'input',
    (event) => {
      if (allowedInputs.includes(event.target.tagName.toLowerCase())) {
        const target = event.target
        const formGroup =
          target.closest('.app-form-group-js') ?? // Using a class as can't add attributes to GOVUK formGroup
          target.closest('[data-js="app-form-group"]')
        const errorMessage = formGroup.querySelector('[data-js="app-error"]')

        formGroup.classList.remove('govuk-form-group--error')
        event.target.classList.remove(
          'govuk-select--error',
          'govuk-input--error',
          'govuk-textarea--error'
        )

        if (errorMessage) {
          errorMessage.remove()
        }
      }
    },
    true
  )
}

export { errorMessages }
