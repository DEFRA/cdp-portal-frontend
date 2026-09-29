const toolDescriptionsMap = {
  terminal: {
    title: 'Terminal',
    summary:
      "A web shell in a container running with your service's permissions.",
    points: [
      'Includes jq, curl, AWS CLI, redis-cli, mongosh and psql.',
      'Use the Files tab to upload files.',
      'Sessions last up to 2 hours.',
      'Changes in the container are lost when the session ends.'
    ]
  },
  pgweb: {
    title: 'Postgres Web UI',
    summary: "A browser UI for your service's Postgres database.",
    points: [
      'Browse tables and run SQL queries.',
      'Export query results.',
      'Sessions last up to 6 hours.'
    ]
  },
  dbgate: {
    title: 'MongoDB Web UI',
    summary: "A browser UI for your service's MongoDB database.",
    points: [
      'Browse collections and documents.',
      'Run queries in the browser.',
      'Sessions last up to 6 hours.'
    ]
  }
}

export function getToolCards(availableTools) {
  return availableTools
    .filter(({ tool }) => Object.hasOwn(toolDescriptionsMap, tool))
    .map(({ tool, canLaunchLatest }) => ({
      ...toolDescriptionsMap[tool],
      value: tool,
      ...(canLaunchLatest && { latestValue: `${tool}_latest` })
    }))
}
