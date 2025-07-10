export const resourceDescriptions = (entityType) => ({
  Repository: `Your ${entityType}'s GitHub repository based on the template you chose`,
  TenantServices: `Supporting infrastructure for your ${entityType}`,
  SquidProxy: `Proxy access set up for your ${entityType}`,
  NginxUpstreams: `Enable your ${entityType} to be accessible to other services/public on the Core Delivery Platform environments`,
  AppConfig: 'Application config creation',
  GrafanaDashboard: `Grafana dashboards for your ${entityType}`
})
