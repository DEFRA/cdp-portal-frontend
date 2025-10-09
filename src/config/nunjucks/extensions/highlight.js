import nunjucks from 'nunjucks'
import highlightJs from 'highlight.js'

class HighlightJsExtension {
  constructor() {
    this.tags = ['highlightjs']

    this.parse = function (parser, nodes) {
      const tok = parser.nextToken()
      const args = parser.parseSignature(null, true)
      parser.advanceAfterBlockEnd(tok.value)

      const body = parser.parseUntilBlocks('highlightjs', 'endhighlightjs')
      parser.advanceAfterBlockEnd()

      return new nodes.CallExtension(this, 'run', args, [body])
    }

    this.run = function (context, language, bodyCallback) {
      const rawCode = bodyCallback()
      const code = highlightJs.highlightAuto(rawCode, [language])
      const html = `<pre class="app-code-container"><code class="hljs app-code language-${language.toLowerCase()}">${code.value}</code></pre>`
      return new nunjucks.runtime.SafeString(html)
    }
  }
}

export { HighlightJsExtension }
