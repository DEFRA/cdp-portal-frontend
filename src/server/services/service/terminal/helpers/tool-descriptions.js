const toolDescriptionsMap = {
  terminal: {
    value: 'terminal',
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
    value: 'pgweb',
    title: 'Postgres Web UI',
    summary: "A browser UI for your service's Postgres database.",
    points: [
      'Browse tables and run SQL queries.',
      'Export query results.'
    ]
  },
  dbgate: {
    value: 'dbgate',
    title: 'MongoDB Web UI',
    summary: "A browser UI for your service's MongoDB database.",
    points: [
      'Browse collections and documents.',
      'Run queries in the browser.'
    ]
  }
}

function stableToolValue(toolValue) {
  return toolValue.replace(/_latest$/, '')
}

export function getToolDescriptions(tools) {
  const orderedUniqueStableValues = []

  for (const tool of tools) {
    const stableValue = stableToolValue(tool.value)
    if (
      toolDescriptionsMap[stableValue] &&
      !orderedUniqueStableValues.includes(stableValue)
    ) {
      orderedUniqueStableValues.push(stableValue)
    }
  }

  return orderedUniqueStableValues.map((value) => toolDescriptionsMap[value])
}
