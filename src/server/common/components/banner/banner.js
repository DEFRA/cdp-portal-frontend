function banner($module) {
  if (!$module) {
    return
  }

  const thirtySeconds = 30000

  setTimeout(function () {
    $module.remove()
  }, thirtySeconds)
}

export { banner }
