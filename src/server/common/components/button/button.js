function button($module) {
  if (!$module) {
    return
  }

  const $loader = document.querySelector(
    `[data-js="${$module.getAttribute('data-loader')}"]`
  )

  const $form = $module.form

  $form.addEventListener('submit', () => {
    setTimeout(() => {
      $module.setAttribute('disabled', 'disabled')
      $loader.classList.add('app-loader--is-loading')
    }, 200)
  })
}

export { button }
