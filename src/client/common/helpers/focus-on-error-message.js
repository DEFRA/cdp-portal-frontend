/**
 * Focus on the first error message on the page
 * @param {HTMLElement} $errorMessage
 */
function focusOnErrorMessage($errorMessage) {
  if (!$errorMessage) {
    return
  }

  document.addEventListener('DOMContentLoaded', () => $errorMessage.focus())
}

export { focusOnErrorMessage }
