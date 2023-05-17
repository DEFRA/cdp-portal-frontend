function button($module) {
  if (!$module) {
    return
  }

  // TODO make this generic
  // TODO target the buttons specific loader in a better way
  const $buttonLoader = document.querySelector('[data-js="app-loader"]')
  const $form = $module.form

  $form.addEventListener('submit', () => {
    $module.setAttribute('disabled', 'disabled')

    setTimeout(() => {
      $buttonLoader.classList.add('app-loader--is-loading')
    }, 200)
  })
}

export { button }
