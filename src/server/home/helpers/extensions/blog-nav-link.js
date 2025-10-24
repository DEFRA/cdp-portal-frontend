const blogNavLinkExtension = (blogPath) => ({
  name: 'link',
  level: 'block',
  renderer(token) {
    const parsedText = this.parser.parseInline(token.tokens)
    const classes = ['app-link']

    if (token.href === blogPath) {
      classes.push('is-active')
    }

    return `<a class="${classes.join(' ')}" href="${token.href}">${parsedText}</a>`
  }
})

export { blogNavLinkExtension }
