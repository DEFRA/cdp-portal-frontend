import qs from 'qs'

function buildInput() {
  const input = document.createElement('input')
  input.type = 'hidden'

  return input
}

function buildHiddenInput(value, name) {
  const hiddenInput = buildInput().cloneNode(true)

  hiddenInput.value = value
  hiddenInput.name = name

  return hiddenInput
}

function paramsToHiddenInputs($module) {
  if (!$module) {
    return
  }

  $module.addEventListener('submit', () => {
    const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })

    Object.entries(queryParams).forEach(([key, value]) => {
      $module.appendChild(buildHiddenInput(value, key))
    })
  })
}

export { paramsToHiddenInputs }
