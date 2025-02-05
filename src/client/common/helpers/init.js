function initClass(attributeName, Klass, attributeSelector = '=') {
  if (!attributeName) {
    return
  }

  const $elements = Array.from(
    document.querySelectorAll(`[data-js${attributeSelector}"${attributeName}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => new Klass($element))
  }
}

function initModule(attributeName, module, attributeSelector = '=') {
  if (!attributeName) {
    return
  }

  const $element = document.querySelector(
    `[data-js${attributeSelector}"${attributeName}"]`
  )

  if ($element) {
    module($element)
  }
}

function initModules(attributeName, module, attributeSelector = '=') {
  if (!attributeName) {
    return
  }

  const $elements = Array.from(
    document.querySelectorAll(`[data-js${attributeSelector}"${attributeName}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => module($element))
  }
}

export { initClass, initModule, initModules }
