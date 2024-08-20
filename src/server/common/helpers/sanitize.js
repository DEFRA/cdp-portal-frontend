/**
 * Sanitize strings
 * @param {string} value
 * @returns {string}
 */
function sanitize(value) {
  return value.replace(/"/gi, '').replace(/'/gi, '')
}

export { sanitize }
