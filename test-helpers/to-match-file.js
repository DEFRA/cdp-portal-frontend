import { toMatchFile } from 'jest-file-snapshot'

/**
 * Augment the toMatchFile method to provide serve markup with local assets build via the 'pretest' npm script. Also
 * provide global defaults for this matcher so they don;t have to be passed everytime we use it
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
  // Update assets path to use local assets so html snapshot uses the local assets provided via the 'pretest' npm script
  const updatedContent = content.replace(/\/public/g, '/.public')

  return toMatchFile.call(this, updatedContent, filename, options)
}

export { toMatchFileWithOptions }
