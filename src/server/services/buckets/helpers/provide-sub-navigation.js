import { provideSubContextNavigation } from '~/src/server/common/helpers/navigation/provide-sub-context-navigation.js'

function provideSubNavigation(request, h) {
  return provideSubContextNavigation(request, 'buckets', h)
}

export { provideSubNavigation }
