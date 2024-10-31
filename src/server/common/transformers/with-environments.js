import camelCase from 'lodash/camelCase.js'

function withEnvironments(services) {
  return services.reduce(
    (withEnvironments, { service, environment, version }) => {
      if (!withEnvironments[service]) {
        withEnvironments[service] = {}
      }

      withEnvironments[service][camelCase(environment)] = version

      return withEnvironments
    },
    {}
  )
}

export { withEnvironments }
