import highlightJs from 'highlight.js'

const codeExtension = {
  name: 'code',
  level: 'block',
  renderer(token) {
    const codeLang = token.lang.toLowerCase()

    if (codeLang === 'mermaid') {
      return `<pre class="mermaid">${token.text}</pre>`
    } else {
      const code = highlightJs.highlightAuto(token.text, [codeLang])
      return `<pre><code class="hljs app-code-hljs language-${codeLang}">${code.value}</code></pre>`
    }
  }
}

export { codeExtension }
