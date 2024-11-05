const headingExtension = {
  name: 'heading',
  level: 'block',
  renderer(token) {
    const { text, depth: level } = token
    const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')

    return `<h${level} id="${internalAnchorId}">
                <a class="heading-link" href="#${internalAnchorId}">${text}</a>
              </h${level}>`
  }
}

export { headingExtension }
