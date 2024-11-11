function isExternalLink(href) {
  return (
    href.startsWith('http') &&
    !(href.startsWith('https://portal') || href.startsWith('http://localhost'))
  )
}

const linkExtension = {
  name: 'link',
  level: 'block',
  renderer(token) {
    const parsedText = this.parser.parseInline(token.tokens)

    if (isExternalLink(token.href)) {
      return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${parsedText}</a>`
    } else {
      return `<a href="${token.href}">${parsedText}</a>`
    }
  }
}

export { linkExtension }
