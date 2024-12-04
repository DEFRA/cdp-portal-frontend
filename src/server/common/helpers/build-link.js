function buildLink(href, textContent, newTab = true) {
  return `<a class="app-link" href="${href}" data-testid="app-link" ${
    newTab ? `target="_blank" rel="noopener noreferrer"` : ''
  }>${textContent}</a>`
}

export { buildLink }
