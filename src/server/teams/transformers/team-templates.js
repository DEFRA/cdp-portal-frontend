function teamTemplates(templates) {
  return (
    templates?.map((template) => ({
      content: {
        html: `<a class="app-link" href="${template.url}" target="_blank">${template.id}</a>`
      }
    })) ?? []
  )
}

export { teamTemplates }
