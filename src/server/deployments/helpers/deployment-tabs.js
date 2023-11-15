function deploymentTabs({ path }) {
  return [
    {
      isActive: path.includes('/deployments/management'),
      url: '/deployments/management',
      label: 'Management'
    },
    {
      isActive: path.includes('/deployments/infra-dev'),
      url: '/deployments/infra-dev',
      label: 'Infra-dev'
    },
    {
      isActive: path.includes('/deployments/dev'),
      url: '/deployments/dev',
      label: 'Dev'
    },
    {
      isActive: path.includes('/deployments/test'),
      url: '/deployments/test',
      label: 'Test'
    },
    {
      isActive: path.includes('/deployments/perf-test'),
      url: '/deployments/perf-test',
      label: 'Perf-test'
    },
    {
      isActive: path.includes('/deployments/prod'),
      url: '/deployments/prod',
      label: 'Prod'
    }
  ]
}

export { deploymentTabs }
