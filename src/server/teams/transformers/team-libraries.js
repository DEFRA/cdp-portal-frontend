function teamLibraries(libraries) {
  return (
    libraries?.map((library) => ({
      content: {
        html: `<a class="app-link"
                   href="${library.url}"
                   target="_blank">${library.id}</a>`
      }
    })) ?? []
  )
}

export { teamLibraries }
