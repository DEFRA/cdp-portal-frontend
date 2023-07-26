import { toggleProtectedInputs } from '~/src/client/common/helpers/protect-form/toggle-protected-inputs'

function protectForm($form) {
  const $controlButton = document.querySelector('[data-js="protected-button"]')

  if (!$form || !$controlButton) {
    return
  }

  const allowedInputs = ['select', 'input']
  const $protectedInputs = Array.from($form.elements).filter(
    ($element) =>
      $element.type !== 'hidden' &&
      allowedInputs.includes($element.tagName.toLowerCase())
  )

  document.addEventListener('DOMContentLoaded', () =>
    toggleProtectedInputs($form, $protectedInputs, true)
  )

  $controlButton.addEventListener('click', () => {
    toggleProtectedInputs(
      $form,
      $protectedInputs,
      $form.dataset.protect !== 'true'
    )
  })
}

export { protectForm }
