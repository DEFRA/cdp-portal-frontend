import { toggleProtectedInputs } from './toggle-protected-inputs.js'

function protectForm($form) {
  const $controlButton = document.querySelector('[data-js="protected-button"]')

  if (!$form) {
    return
  }

  const allowedInputs = ['select', 'input']

  if ($form.dataset.protectSubmitButton) {
    allowedInputs.push('button')
  }

  const $protectedInputs = Array.from($form.elements).filter(
    ($element) =>
      $element.type !== 'hidden' &&
      allowedInputs.includes($element.tagName.toLowerCase()) &&
      $element !== $controlButton
  )

  document.addEventListener('DOMContentLoaded', () =>
    toggleProtectedInputs($form, $protectedInputs, true)
  )

  $controlButton?.addEventListener('click', (event) => {
    event.preventDefault()

    toggleProtectedInputs(
      $form,
      $protectedInputs,
      $form.dataset.protect !== 'true'
    )
  })
}

export { protectForm }
