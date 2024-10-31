import isNil from 'lodash/isNil.js'

function removeNil(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => !isNil(value))
  )
}
export { removeNil }
