const navLinkExtension = (documentationPath) => ({
  name: 'link',
  level: 'block',
  renderer(token) {
    const parsedText = this.parser.parseInline(token.tokens)
    const classes = ['app-link']

    if (token.href === `/${documentationPath}`) {
      classes.push('is-active')
    }

    return `<a class="${classes.join(' ')}" href="/documentation${token.href}">${parsedText}</a>`
  }
})

export { navLinkExtension }
