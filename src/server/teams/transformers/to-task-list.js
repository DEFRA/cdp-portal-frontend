import { buildLink } from '~/src/server/common/helpers/build-link.js'
import { config } from '~/src/config/config.js'

function transformToTaskList(repositories = []) {
  const githubOrg = config.get('githubOrg')

  const items = repositories.map((repository) => {
    return {
      title: {
        html: buildLink(repository.url, `${githubOrg}/${repository.id}`)
      },
      hint: {
        text: repository.description
      }
    }
  })

  return {
    classes: 'app-task-list app-task-list--no-border govuk-!-margin-bottom-8',
    items
  }
}

export { transformToTaskList }
