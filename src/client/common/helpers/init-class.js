function initClass(attributeName, Klass, attributeSelector = '=') {
  const $elements = Array.from(
    document.querySelectorAll(`[data-js${attributeSelector}"${attributeName}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => new Klass($element))
  }
}

export { initClass }
