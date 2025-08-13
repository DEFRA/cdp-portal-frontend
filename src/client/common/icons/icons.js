export const tickSvgIcon = (classes = '') => {
  const tickClasses = `app-icon app-tick-icon ${classes}`.trim()
  const nameSpace = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(nameSpace, 'svg')

  svg.setAttribute('class', tickClasses)
  svg.setAttribute('width', '48')
  svg.setAttribute('height', '48')
  svg.setAttribute('viewBox', '0 -960 960 960')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.setAttribute('data-testid', 'app-tick-icon')

  const path = document.createElementNS(nameSpace, 'path')

  path.setAttribute(
    'd',
    'm419-285 291-292-63-64-228 228-111-111-63 64 174 175Zm60.679 226q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z'
  )
  svg.appendChild(path)

  return svg
}
