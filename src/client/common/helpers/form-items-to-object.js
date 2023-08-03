function formItemsToObject(formElements) {
  return Array.from(formElements).reduce(
    (obj, { value, name }) => ({
      ...obj,
      ...(value && { [name]: value })
    }),
    {}
  )
}

export { formItemsToObject }
