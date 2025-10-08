export const mockServiceTabs = ({ serviceName, url }) => {
  const serviceBaseUrl = `/services/${serviceName}`

  return [
    {
      isActive: url === serviceBaseUrl,
      url: `${serviceBaseUrl}`,
      label: 'About'
    },
    {
      isActive: url === `${serviceBaseUrl}/resources`,
      url: `${serviceBaseUrl}/resources`,
      label: 'Resources'
    },
    {
      isActive: url === `${serviceBaseUrl}/proxy`,
      url: `${serviceBaseUrl}/proxy`,
      label: 'Proxy'
    },
    {
      isActive: url === `${serviceBaseUrl}/automations`,
      url: `${serviceBaseUrl}/automations`,
      label: 'Automations'
    },
    {
      isActive: url === `${serviceBaseUrl}/secrets`,
      url: `${serviceBaseUrl}/secrets`,
      label: 'Secrets'
    },
    {
      isActive: url === `${serviceBaseUrl}/maintenance`,
      url: `${serviceBaseUrl}/maintenance`,
      label: 'Maintenance'
    },
    {
      isActive: url === `${serviceBaseUrl}/terminal`,
      url: `${serviceBaseUrl}/terminal`,
      label: 'Terminal'
    }
  ]
}
