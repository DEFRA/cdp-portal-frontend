import { createHiddenInput } from '~/src/client/common/helpers/protect-form/create-hidden-input'

function toggleProtectedInputs($form, $protectedInputs, protect) {
  $protectedInputs.forEach(($input) => {
    if (protect) {
      $input.setAttribute('disabled', 'disabled')

      const $hiddenInput = createHiddenInput($input.name, $input.value)
      $form.appendChild($hiddenInput)
    } else {
      $input.removeAttribute('disabled')

      const $protectedHiddenInput = document.getElementById(
        `${$input.name}-protected-hidden`
      )
      $protectedHiddenInput?.remove()
    }
  })

  $form.dataset.protect = protect.toString()
}

export { toggleProtectedInputs }
