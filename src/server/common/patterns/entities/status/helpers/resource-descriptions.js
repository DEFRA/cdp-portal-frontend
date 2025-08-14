export const resourceDescriptions = (entityKind) => ({
  Repository: `Your ${entityKind}'s GitHub repository based on the template you chose`,
  TenantServices: `Supporting infrastructure for your ${entityKind}`,
  SquidProxy: `Proxy access set up for your ${entityKind}`,
  NginxUpstreams: `Enable your ${entityKind} to be accessible to other services/public on the Core Delivery Platform environments`,
  AppConfig: 'Application config creation',
  GrafanaDashboard: `Grafana dashboards for your ${entityKind}`
})
