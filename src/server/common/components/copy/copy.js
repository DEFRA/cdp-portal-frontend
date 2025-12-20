import { clientNotification } from '../../../../client/common/helpers/client-notification.js'
import { tickSvgIcon } from '../../../../client/common/icons/icons.js'
import { copyFeedbackDuration } from '../../../../client/common/constants/timing.js'

function copy($module) {
  if (!$module) {
    return
  }

  const $content = document.querySelector(
    `[data-js*="${$module.dataset.contentId}-content"]`
  )
  const $copyIcon = $module.firstElementChild
  const $tickIcon = tickSvgIcon('app-icon app-icon--minute')
  const $copiedHint = document.createElement('span')
  $copiedHint.className = 'app-copy__hint'
  $copiedHint.dataset.testid = 'app-copy-hint'
  $copiedHint.textContent = 'Copied'

  $module.addEventListener('click', async () => {
    const text = $content.textContent.trim()

    try {
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('Clipboard API not supported')
      }
    } catch (error) {
      clientNotification(
        'Error copying text to clipboard, select text with your cursor and ctrl + c'
      )
    } finally {
      $module.parentNode.insertBefore($copiedHint, $module)
      $module.replaceChild($tickIcon, $copyIcon)

      setTimeout(() => {
        $module.replaceChild($copyIcon, $tickIcon)
        $copiedHint.remove()
      }, copyFeedbackDuration)
    }
  })
}

export { copy }
