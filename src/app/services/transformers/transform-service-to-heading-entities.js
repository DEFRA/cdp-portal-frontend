function transformServiceToHeadingEntities(service) {
  return {
    primary: [
      {
        kind: 'text',
        value: service.kind,
        size: 'small',
        label: 'Type'
      },
      {
        kind: 'link',
        value: service.repository,
        url: `https://github.com/DEFRA/${service.repository}`,
        newWindow: true,
        size: 'medium',
        label: 'GitHub repository'
      },
      {
        kind: 'link',
        value: `@${service.owner}`,
        url: `https://github.com/orgs/defra-cdp-sandpit/people/${service.owner}`,
        newWindow: true,
        size: 'medium',
        label: 'Owner'
      }
    ],
    secondary: [
      {
        kind: 'date',
        value: service.timestamp,
        size: 'large',
        label: 'Last updated'
      }
    ]
  }
}

export { transformServiceToHeadingEntities }
