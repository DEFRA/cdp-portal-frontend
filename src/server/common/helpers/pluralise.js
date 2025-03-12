function pluralise(string, count) {
  let result = string

  if (count !== 1 && result) {
    if (string.match(/[^aeiou]y$/)) {
      result = string.replace(/y$/, 'ies')
    } else {
      result += 's'
    }
  }

  return result
}

export { pluralise }
