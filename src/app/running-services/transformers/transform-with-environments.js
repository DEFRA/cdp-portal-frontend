import { camelCase } from 'lodash'

// TODO this needs some re-work
function transformWithEnvironments(services) {
  return services.reduce(
    (withEnvironments, { service, environment, version, dockerImage }) => {
      if (!withEnvironments[service]) {
        withEnvironments[service] = {}
      }

      withEnvironments[service][camelCase(environment)] = version
      withEnvironments[service].dockerImage = dockerImage

      return withEnvironments
    },
    {}
  )
}

export { transformWithEnvironments }
