import { isFunction } from 'lodash'

function getComponent(name) {
  const component = this.ctx[name]

  if (!isFunction(component)) {
    return
  }

  return component
}

export { getComponent }
