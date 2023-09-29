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
