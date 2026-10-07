const toolDescriptionsMap = {
  terminal: {
    title: 'Terminal',
    summary:
      "A web shell in a container running with your service's permissions.",
    points: [
      'Includes jq, curl, AWS CLI, redis-cli, mongosh and psql.',
      'Use the Files tab to upload files.',
      'Changes in the container are lost when the session ends.'
    ]
  },
  pgweb: {
    title: 'Postgres Web UI',
    summary:
      "Runs an instance of pgweb connected to your service's Postgres database.",
    points: ['Browse tables and run SQL queries.', 'Export query results.']
  },
  dbgate: {
    title: 'MongoDB Web UI',
    summary:
      "Runs an instance of DBGate connected to your service's MongoDB database.",
    points: ['Browse collections and documents.', 'Run queries in the browser.']
  },
  sqs_tool: {
    title: 'SQS Web UI',
    summary:
      "Lists your service's dead letter queues and lets you redrive messages.",
    points: [
      'Shows queue metrics and running redrive task status.',
      'Redrives from DLQ back to the source queue.',
      'In prod, message content is hidden unless you have break glass access.'
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
