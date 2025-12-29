import nunjucks from 'nunjucks'
import highlightJs from 'highlight.js'

/**
 * Unescape HTML entities back to their original characters.
 * Nunjucks auto-escapes content, so we need to reverse that.
 */
function unescapeHtml(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&') // Must be last to avoid double-unescaping
}

/**
 * Nunjucks extension for syntax highlighting code blocks.
 *
 * Usage:
 *   {% highlightjs "javascript" %}
 *   const foo = "bar"
 *   {% endhighlightjs %}
 */
function HighlightJsExtension() {
  this.tags = ['highlightjs']

  this.parse = function (parser, nodes) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(tok.value)

    const body = parser.parseUntilBlocks('endhighlightjs')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtension(this, 'run', args, [body])
  }

  this.run = function (_context, language, bodyCallback) {
    // bodyCallback returns escaped HTML - unescape it first
    const escapedCode = bodyCallback()
    const rawCode = unescapeHtml(escapedCode)

    const code = highlightJs.highlightAuto(rawCode, [language])
    const html = `<pre><code class="hljs app-code app-code-hljs language-${language.toLowerCase()}">${code.value}</code></pre>`
    return new nunjucks.runtime.SafeString(html)
  }
}

export { HighlightJsExtension }
