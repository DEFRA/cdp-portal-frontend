function stripHtml(input) {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export { stripHtml }
