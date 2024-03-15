function initModule(attributeName, module, attributeSelector = '=') {
  const $elements = Array.from(
    document.querySelectorAll(`[data-js${attributeSelector}"${attributeName}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => module($element))
  }
}

export { initModule }
