function extractIds(ids, kind) {
  return ids
    .filter((id) => id.startsWith(`${kind}:`))
    .map((id) => id.split(':').at(1))
}

export { extractIds }
