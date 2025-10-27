/**
 * Extension to be used on blog preview articles. Preview headings extension that adds an anchor to h1 elements on the
 * page linking to the blog article. All other heading elements have in page internal anchors adding to them
 * @param {string} articlePath
 * @returns {{name: string, level: string, renderer(*): string}}
 */

const previewHeadingsExtension = (articlePath) => ({
  name: 'heading',
  level: 'block',
  renderer(token) {
    const { text, depth: level } = token
    const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')
    const parsedText = this.parser.parseInline(token.tokens)
    let anchor

    if (articlePath && level === 1) {
      anchor = `<a class="app-link app-link--text-colour" href="${articlePath}">${parsedText}</a>`
    } else {
      anchor = `<a class="heading-link" href="#${internalAnchorId}">${parsedText}</a>`
    }

    return `<h${level} id="${internalAnchorId}">${anchor}</h${level}>`
  }
})

export { previewHeadingsExtension }
