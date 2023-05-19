function sortByAsc(value) {
  return (a, b) => {
    if (a[value] > b[value]) {
      return 1
    }

    if (a[value] < b[value]) {
      return -1
    }

    return 0
  }
}

function sortByDesc(value) {
  return (a, b) => {
    if (a[value] < b[value]) {
      return 1
    }

    if (a[value] > b[value]) {
      return -1
    }

    return 0
  }
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
