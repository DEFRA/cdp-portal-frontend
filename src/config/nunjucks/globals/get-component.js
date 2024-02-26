import { isFunction } from 'lodash'

// Get component by name in templates
function getComponent(name) {
  const component = this.ctx[name]

  if (!isFunction(component)) {
    return
  }

  return component
}

export { getComponent }
