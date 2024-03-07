function teamRepositories(repositories) {
  return (
    repositories?.map((repository) => ({
      content: {
        html: `<a class="app-link" href="${repository.url}" target="_blank">${repository.id}</a>`
      }
    })) ?? []
  )
}

export { teamRepositories }
