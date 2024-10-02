import markdownParser from 'markdown-it'
import anchor from 'markdown-it-anchor'

// once we have moved to ESM https://mdit-plugins.github.io/alert.html gives us support for gfm markdown
export const markdown = markdownParser({
  html: false,
  typographer: true,
  breaks: true,
  linkify: true
}).use(anchor) // required for page links to work
