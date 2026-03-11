export function buildPostButton({
  action,
  text,
  csrf,
  classes = [
    'govuk-button',
    'app-button',
    'app-button--primary',
    'app-button--small'
  ],
  dataTestId = 'app-button'
}) {
  return `<form action="${action}" method="POST">
    <input type="hidden" name="csrfToken" value="${csrf}">
    <button
      type="submit"
      class="${classes.join(' ')}"
      data-module="govuk-button"
      data-testid="${dataTestId}">
      ${text}
    </button>
  </form>`
}
