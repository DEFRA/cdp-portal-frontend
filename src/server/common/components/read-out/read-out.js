import { replaceForbiddenCharacters } from '~/src/server/common/components/read-out/helpers/replace-forbidden-characters'

function readOut($module) {
  if (!$module) {
    return
  }

  const $targetElement = document.getElementById(
    $module.getAttribute('data-target-id')
  )

  if (!$targetElement) {
    return
  }

  $module.addEventListener('input', (event) => {
    $targetElement.textContent = replaceForbiddenCharacters(
      event?.target?.value
    )
  })

  window.addEventListener('DOMContentLoaded', () => {
    if ($module?.value) {
      $targetElement.textContent = replaceForbiddenCharacters($module?.value)
    }
  })
}

export { readOut }
