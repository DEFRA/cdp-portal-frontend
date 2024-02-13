import { config } from '~/src/config'

function teamTemplates(templates) {
  const githubOrg = config.get('githubOrg')

  return (
    templates?.map((template) => ({
      content: {
        html: `<a class="app-link" href="${template.url}" target="_blank">${githubOrg}/${template.id}</a>`
      }
    })) ?? []
  )
}

export { teamTemplates }
