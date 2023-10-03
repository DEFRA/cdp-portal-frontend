function buildLink(href, textContent) {
  return `<a class="app-link" href="${href}" target="_blank" rel="noopener noreferrer">${textContent}</a>`
}

export { buildLink }
