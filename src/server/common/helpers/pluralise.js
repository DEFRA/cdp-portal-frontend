function pluralise(string, count) {
  if (count !== 1) {
    if (string.match(/[^aeiou]y$/)) {
      string = string.replace(/y$/, 'ies')
    } else {
      string += 's'
    }
  }

  return string
}

export { pluralise }
