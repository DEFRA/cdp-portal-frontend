import { sortKeyByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'

function transformVanityUrls(vanityUrls) {
  return Object.entries(vanityUrls)
    .map(([environment, { vanityUrls }]) => ({
      environment,
      urls: vanityUrls
    }))
    .sort(sortKeyByEnv('environment'))
}

export { transformVanityUrls }
