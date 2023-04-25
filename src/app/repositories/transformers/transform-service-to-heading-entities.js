function transformRepositoryToHeadingEntities(repository) {
  return {
    primary: [
      {
        kind: 'text',
        value: repository.kind,
        size: 'small',
        label: 'Type'
      },
      {
        kind: 'link',
        value: repository.gitHubUrl,
        url: `https://github.com/DEFRA/${repository.gitHubUrl}`,
        newWindow: true,
        size: 'medium',
        label: 'GitHub repository'
      },
      {
        kind: 'link',
        value: `@${repository.owner}`,
        url: `https://github.com/orgs/defra-cdp-sandpit/people/${repository.owner}`,
        newWindow: true,
        size: 'medium',
        label: 'Owner'
      }
    ],
    secondary: [
      {
        kind: 'date',
        value: repository.timestamp,
        size: 'large',
        label: 'Last updated'
      }
    ]
  }
}

export { transformRepositoryToHeadingEntities }
