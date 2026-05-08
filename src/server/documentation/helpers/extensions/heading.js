import { headingToAnchor } from './heading-anchor.js'

const headingExtension = {
  name: 'heading',
  level: 'block',
  renderer(token) {
    const { text, depth: level } = token
    const internalAnchorId = headingToAnchor(text)
    const parsedText = this.parser.parseInline(token.tokens)

    return `<h${level} id="${internalAnchorId}">
                <a class="heading-link" href="#${internalAnchorId}">${parsedText}</a>
              </h${level}>`
  }
}

export { headingExtension }
