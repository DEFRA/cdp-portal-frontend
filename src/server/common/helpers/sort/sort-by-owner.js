function sortByOwner(prop) {
  return (a, b) => {
    if (a.isOwner && !b.isOwner) {
      return -1
    }
    if (!a.isOwner && b.isOwner) {
      return 1
    }

    return a[prop].localeCompare(b[prop])
  }
}

export { sortByOwner }
