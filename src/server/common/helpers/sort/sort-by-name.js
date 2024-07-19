const sortByName = (a, b) => {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1
  }

  if (a.toLowerCase() > b.toLowerCase()) {
    return 1
  }

  return 0
}

export { sortByName }
