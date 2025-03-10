import { provideService } from '~/src/server/services/helpers/provide-service.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { validateServiceIsNotATestSuite } from '~/src/server/services/helpers/validate-service-is-not-a-test-suite.js'

const provideServiceExtension = {
  type: 'onPreAuth',
  method: provideService,
  options: {
    sandbox: 'plugin'
  }
}

const notATestSuiteExtension = {
  type: 'onPreHandler',
  method: validateServiceIsNotATestSuite,
  options: {
    sandbox: 'plugin'
  }
}

const provideTabsExtension = {
  type: 'onPostHandler',
  method: provideTabs,
  options: {
    sandbox: 'plugin'
  }
}

const commonServiceExtensions = [
  provideServiceExtension,
  notATestSuiteExtension,
  provideTabsExtension
]

export {
  commonServiceExtensions,
  provideServiceExtension,
  provideTabsExtension
}
