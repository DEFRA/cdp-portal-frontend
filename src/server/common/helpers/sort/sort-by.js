function sortByAsc(key) {
  return (a, b) => a[key].localeCompare(b[key])
}

function sortByDesc(key) {
  return (a, b) => b[key].localeCompare(a[key])
}

function sortBy(key, direction = 'desc') {
  if (direction === 'asc') {
    return sortByAsc(key)
  }

  if (direction === 'desc') {
    return sortByDesc(key)
  }
}

export { sortBy }
