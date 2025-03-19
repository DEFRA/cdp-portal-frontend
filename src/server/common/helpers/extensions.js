import { provideService } from '~/src/server/common/helpers/provide-service.js'
import { provideServiceTabs } from '~/src/server/services/helpers/provide-service-tabs.js'
import { validateServiceIsNotATestSuite } from '~/src/server/common/helpers/validate-service-is-not-a-test-suite.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { provideTestSuiteTabs } from '~/src/server/test-suites/helpers/provide-test-suite-tabs.js'

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

const provideServiceTabsExtension = {
  type: 'onPostHandler',
  method: provideServiceTabs,
  options: {
    sandbox: 'plugin'
  }
}

const provideTestSuiteTabsExtension = {
  type: 'onPostHandler',
  method: provideTestSuiteTabs,
  options: {
    sandbox: 'plugin'
  }
}

const commonServiceExtensions = [
  provideServiceExtension,
  addServiceOwnerScopeExtension,
  notATestSuiteExtension,
  provideServiceTabsExtension
]

const commonTestSuiteExtensions = [
  provideServiceExtension,
  addServiceOwnerScopeExtension,
  provideTestSuiteTabsExtension
]

export {
  addServiceOwnerScopeExtension,
  commonServiceExtensions,
  commonTestSuiteExtensions,
  provideServiceExtension,
  provideServiceTabsExtension,
  provideTestSuiteTabsExtension
}
