export const resourceDescriptions = (entityKind) => ({
  Repository: `Your ${entityKind}'s GitHub repository based on the template you chose`,
  Infra: `Supporting infrastructure for your ${entityKind}`,
  Squid: `Proxy access set up for your ${entityKind}`,
  Nginx: `Enable your ${entityKind} to be accessible to other services/public on the Core Delivery Platform environments`,
  AppConfig: 'Application config creation',
  Metrics: `Grafana dashboards for your ${entityKind}`,
  Logs: `Opensearch logging & dashboards for your ${entityKind}`
})
