import { isFunction } from 'lodash'

// Programmatically render components in JS
function renderComponent(name) {
  const component = this.ctx[name]

  if (!isFunction(component)) {
    return
  }

  return component
}

export { renderComponent }
