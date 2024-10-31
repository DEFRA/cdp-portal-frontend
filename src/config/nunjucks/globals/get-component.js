import isFunction from 'lodash/isFunction.js'

// Get component by name in templates
function getComponent(name) {
  const component = this.ctx[name]

  if (!isFunction(component)) {
    return
  }

  return component
}

export { getComponent }
