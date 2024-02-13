import { config } from '~/src/config'

function teamLibraries(libraries) {
  const githubOrg = config.get('githubOrg')

  return (
    libraries?.map((library) => ({
      content: {
        html: `<a class="app-link"
                   href="${library.url}"
                   target="_blank">${githubOrg}/${library.id}</a>`
      }
    })) ?? []
  )
}

export { teamLibraries }
