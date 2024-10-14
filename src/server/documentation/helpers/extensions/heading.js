const headingExtension = {
  name: 'heading',
  level: 'block',
  renderer(token) {
    const { text, depth: level } = token
    const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')

    return `<h${level} id="${internalAnchorId}">
                ${text}
                <a class="anchor-link" href="#${internalAnchorId}">#</a>
              </h${level}>`
  }
}

export { headingExtension }
