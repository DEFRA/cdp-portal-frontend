function transformCodeRepositoryToHeadingEntities(codeRepository) {
  return {
    primary: [
      {
        kind: 'text',
        value: codeRepository.kind,
        size: 'small',
        label: 'Type'
      },
      {
        kind: 'link',
        value: codeRepository.gitHubUrl,
        url: `https://github.com/DEFRA/${codeRepository.gitHubUrl}`,
        newWindow: true,
        size: 'medium',
        label: 'GitHub repository'
      },
      {
        kind: 'link',
        value: `@${codeRepository.owner}`,
        url: `https://github.com/orgs/defra-cdp-sandpit/people/${codeRepository.owner}`,
        newWindow: true,
        size: 'medium',
        label: 'Owner'
      }
    ],
    secondary: [
      {
        kind: 'date',
        value: codeRepository.timestamp,
        size: 'large',
        label: 'Last updated'
      }
    ]
  }
}

export { transformCodeRepositoryToHeadingEntities }
