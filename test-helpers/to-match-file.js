import { toMatchFile } from 'jest-file-snapshot'

/**
 * Curry the toMatchFile method to provide global options for this matcher so they don't have to be passed everytime
 * we use it
 *
 * @param {string} content
 * @param {filename} filename
 * @param {import('jest-file-snapshot').FileMatcherOptions} options
 * @returns {jest.CustomMatcherResult}
 */
function toMatchFileWithOptions(
  content,
  filename,
  options = { fileExtension: '.html' }
) {
  return toMatchFile.call(this, content, filename, options)
}

export { toMatchFileWithOptions }
