import { provideSubContextNavigation } from '~/src/server/services/helpers/navigation/provide-sub-context-navigation.js'

function provideSubNavigation(request, h) {
  return provideSubContextNavigation(request, 'proxy', h)
}

export { provideSubNavigation }
