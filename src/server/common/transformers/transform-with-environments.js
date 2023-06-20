import { camelCase } from 'lodash'

function transformWithEnvironments(services) {
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

export { transformWithEnvironments }
