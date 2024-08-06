/**
 * @param {HTMLElement | undefined | null} $module - HTML element to use for banner
 */
function banner($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  const twentySeconds = 20000

  setTimeout(function () {
    $module.remove()
  }, twentySeconds)
}

export { banner }
