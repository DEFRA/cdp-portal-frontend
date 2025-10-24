const excludedFiles = ['nav.md', 'blog-nav.md']
const excludedPaths = ['blog/']

function shouldExcludedItem(value) {
  if (excludedFiles.includes(value)) {
    return true
  }

  return excludedPaths.some((excludedPath) => value.startsWith(excludedPath))
}

export { shouldExcludedItem }
