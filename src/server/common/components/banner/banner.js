import { notificationTimeout } from '../../../../client/common/constants/timing.js'

/**
 * @param {HTMLElement | undefined | null} $module - HTML element to use for banner
 */
function banner($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  setTimeout(() => {
    $module.remove()
  }, notificationTimeout)
}

export { banner }
