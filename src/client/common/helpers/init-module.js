function initModule(className, module) {
  const $elements = Array.from(
    document.querySelectorAll(`[data-js="${className}"]`)
  )

  if ($elements.length) {
    $elements.forEach(($element) => module($element))
  }
}

export { initModule }
