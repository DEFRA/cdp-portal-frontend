function replaceForbiddenCharacters(value) {
  return value.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
}

export { replaceForbiddenCharacters }
