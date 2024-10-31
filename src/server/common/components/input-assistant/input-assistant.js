import { isUsingBadNamingConventions } from '~/src/server/common/components/input-assistant/helpers/is-using-bad-naming-conventions.js'

function checkForBadName(value, $elem, $message) {
  const message = $elem.dataset.message
  const isUsingBadName = isUsingBadNamingConventions(value)

  $elem.classList.add('app-input-assistant--has-message')

  if (!isUsingBadName) {
    $elem.classList.remove('app-input-assistant--has-message')
  }

  $message.textContent = isUsingBadName ? message : ''
}

function inputAssistant($module) {
  if (!$module) {
    return
  }

  const $targetElement = document.getElementById(
    $module.getAttribute('data-input-assistant-target-id')
  )

  if (!$targetElement) {
    return
  }

  const $messageHolder = $targetElement.querySelector(
    '.app-input-assistant__content'
  )

  $module.addEventListener('input', (event) =>
    checkForBadName(event?.target?.value, $targetElement, $messageHolder)
  )

  window.addEventListener('DOMContentLoaded', () => {
    if ($module?.value) {
      checkForBadName($module?.value, $targetElement, $messageHolder)
    }
  })
}

export { inputAssistant }
