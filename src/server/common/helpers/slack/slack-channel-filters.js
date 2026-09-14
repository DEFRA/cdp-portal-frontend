export async function getSlackChannelFilters(server) {
  const channels = await server.methods.getSlackChannels()
  const slackChannelFilters = channels
    .filter((channel) => !channel.is_archived)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((channel) => ({
      value: channel.name_normalized,
      text: channel.name
    }))

  slackChannelFilters.unshift({
    text: ' - - select - - ',
    disabled: true,
    attributes: { selected: true }
  })
  return slackChannelFilters
}
