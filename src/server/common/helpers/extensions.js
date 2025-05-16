import { provideServiceTabs } from '~/src/server/services/helpers/provide-service-tabs.js'
import { validateEntityIsAService } from '~/src/server/common/helpers/validate-entity-is-a-service.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { provideTestSuiteTabs } from '~/src/server/test-suites/helpers/provide-test-suite-tabs.js'
import { provideEntity } from '~/src/server/test-suites/helpers/pre/provide-test-suite.js'
import { validateEntityIsATestSuite } from '~/src/server/common/helpers/validate-entity-is-a-test-suite.js'

const provideEntityExtension = {
  type: 'onPreAuth',
  method: provideEntity,
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

const entityIsAServiceExtension = {
  type: 'onPreHandler',
  method: validateEntityIsAService,
  options: {
    sandbox: 'plugin'
  }
}

const entityIsATestSuiteExtension = {
  type: 'onPreHandler',
  method: validateEntityIsATestSuite,
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
  provideEntityExtension,
  addServiceOwnerScopeExtension,
  entityIsAServiceExtension,
  provideServiceTabsExtension
]

const commonTestSuiteExtensions = [
  provideEntityExtension,
  addServiceOwnerScopeExtension,
  entityIsATestSuiteExtension,
  provideTestSuiteTabsExtension
]

export {
  commonServiceExtensions,
  commonTestSuiteExtensions,
  provideServiceTabsExtension,
  provideTestSuiteTabsExtension
}
