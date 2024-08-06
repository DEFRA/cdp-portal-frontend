function sortByAsc(value) {
  return (a, b) => a[value].localeCompare(b[value])
}

function sortByDesc(value) {
  return (a, b) => b[value].localeCompare(a[value])
}

function sortBy(value, direction = 'desc') {
  if (direction === 'asc') {
    return sortByAsc(value)
  }

  if (direction === 'desc') {
    return sortByDesc(value)
  }
}

export { sortBy }
