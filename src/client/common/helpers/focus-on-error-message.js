function focusOnErrorMessage($errorMessage) {
  if (!$errorMessage) {
    console.log('no error message')
    return
  }

  console.log($errorMessage, 'hi')

  $errorMessage.focus()

  document.addEventListener('DOMContentLoaded', () => $errorMessage.focus())
}

export { focusOnErrorMessage }
