function buildRepoVisibilityHelpText(create) {
  switch (create) {
    case 'internal':
      return (
        'Repository visibility has been set to <b>Internal</b>. This should only be used for repositories ' +
        'containing sensitive information.'
      )
    case 'private':
      return (
        'Repository visibility has been set to <b>Private</b>. Only members of the Owning Team will be able to' +
        ' view the repoitory. Consider using <b>Internal</b> instead.'
      )
  }
}

function buildHelpText(create) {
  if (create === 'public') return null
  return `<p class="govuk-!-margin-bottom-2">
            ${buildRepoVisibilityHelpText(create)}
          </p>`.trim()
}

export { buildHelpText }
