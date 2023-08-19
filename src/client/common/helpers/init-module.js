// TODO need to handle multiple items on `data-js` better
function initModule(className, module, attributeSelector = '=') {
  const $elements = Array.from(
    document.querySelectorAll(`[data-js${attributeSelector}"${className}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => module($element))
  }
}

export { initModule }
