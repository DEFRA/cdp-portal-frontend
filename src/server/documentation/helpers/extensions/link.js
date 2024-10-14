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
    if (isExternalLink(token.href)) {
      return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${token.text}</a>`
    } else {
      return `<a href="${token.href}">${token.text}</a>`
    }
  }
}

export { linkExtension }
