import { config } from '~/src/config'

function transformTeamRepositories(repositories) {
  const githubOrg = config.get('githubOrg')

  return (
    repositories?.map((repository) => ({
      content: {
        html: `<a class="app-link" href="${repository.url}" target="_blank">${githubOrg}/${repository.id}</a>`
      }
    })) ?? []
  )
}

export { transformTeamRepositories }
