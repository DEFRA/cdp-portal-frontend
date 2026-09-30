export function buildTerminalBreadcrumbs(serviceName) {
  return [
    {
      text: 'Services',
      href: '/services'
    },
    {
      text: serviceName,
      href: `/services/${serviceName}`
    },
    {
      text: 'Terminal'
    }
  ]
}
