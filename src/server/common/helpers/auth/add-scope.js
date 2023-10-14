/**
 * Used to add a scope to an array of routes
 *
 * @param scope
 * @returns {function(*): *&{options: {auth: {mode: string, access: {scope: *}}}}}
 */
function addScope(scope) {
  return (route) => ({
    ...route,
    options: {
      ...(route.options && route.options),
      auth: {
        mode: 'required',
        access: {
          scope
        }
      }
    }
  })
}

export { addScope }
