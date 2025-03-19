/**
 * Should this link open in a new page? If it's a non portal link or localhost link, or a png or jpg linked image
 * @param {string} href
 * @returns {boolean}
 */
function isNewPageLink(href) {
  const isExternalLink =
    href.startsWith('http') &&
    !href.startsWith('https://portal') &&
    !href.startsWith('http://localhost')
  const isImageLink = href.endsWith('.png') || href.endsWith('.jpg')
  return isExternalLink || isImageLink
}

const linkExtension = {
  name: 'link',
  level: 'block',
  renderer(token) {
    const parsedText = this.parser.parseInline(token.tokens)

    if (isNewPageLink(token.href)) {
      return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${parsedText}</a>`
    } else {
      return `<a href="${token.href}">${parsedText}</a>`
    }
  }
}

export { linkExtension }
