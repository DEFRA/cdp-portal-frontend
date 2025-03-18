import { provideService } from '~/src/server/common/helpers/provide-service.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { validateServiceIsNotATestSuite } from '~/src/server/common/helpers/validate-service-is-not-a-test-suite.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'

const provideServiceExtension = {
  type: 'onPreAuth',
  method: provideService,
  options: {
    sandbox: 'plugin'
  }
}

const addServiceOwnerScopeExtension = {
  type: 'onCredentials',
  method: addServiceOwnerScope,
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
  addServiceOwnerScopeExtension,
  notATestSuiteExtension,
  provideTabsExtension
]

export {
  addServiceOwnerScopeExtension,
  commonServiceExtensions,
  provideServiceExtension,
  provideTabsExtension
}
