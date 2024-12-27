function buildLink(href, textContent = null, newTab = true) {
  return `<a class="app-link" href="${href}" data-testid="app-link" ${
    newTab ? `target="_blank" rel="noopener noreferrer"` : ''
  }>${textContent ?? href}</a>`
}

export { buildLink }
