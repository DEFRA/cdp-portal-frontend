import { provideServiceTabs } from '../../services/helpers/provide-service-tabs.js'
import { validateEntityIsAService } from './validate-entity-is-a-service.js'
import { addServiceOwnerScope } from '../../services/helpers/add-service-owner-scope.js'
import { provideTestSuiteTabs } from '../../test-suites/helpers/provide-test-suite-tabs.js'
import { validateEntityIsATestSuite } from './validate-entity-is-a-test-suite.js'
import { provideMessages } from '../../services/helpers/provide-messages.js'
import { provideEntity } from './provide-entitiy.js'

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

const provideMessagesExtension = {
  type: 'onPostHandler',
  method: provideMessages,
  options: {
    sandbox: 'plugin'
  }
}

const commonServiceExtensions = [
  provideEntityExtension,
  addServiceOwnerScopeExtension,
  entityIsAServiceExtension,
  provideServiceTabsExtension,
  provideMessagesExtension
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
  provideEntityExtension,
  provideServiceTabsExtension,
  provideTestSuiteTabsExtension
}
