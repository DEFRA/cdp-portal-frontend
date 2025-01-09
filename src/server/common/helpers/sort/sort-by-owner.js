function sortByOwner(a, b) {
  if (a.userOwnsService && !b.userOwnsService) {
    return -1
  }
  if (!a.userOwnsService && b.userOwnsService) {
    return 1
  }

  return a.serviceName.localeCompare(b.serviceName)
}

export { sortByOwner }
