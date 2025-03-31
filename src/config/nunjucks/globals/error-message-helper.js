/**
 * Form input error message wrapper. Wraps text in an object with global error message attributes
 * Returns an error object and renders an error only if there is an error message
 * @param {string} text
 * @returns {null | {attributes: {"data-js": string, tabindex: string}, text}}
 */
function errorMessageHelper(text) {
  return text
    ? {
        attributes: {
          'data-js': 'app-error',
          tabindex: '-1'
        },
        text
      }
    : null
}

export { errorMessageHelper }
