import { launchTerminalController } from '~/src/server/services/terminal/controllers/launch-terminal.js'
import { terminalController } from '~/src/server/services/terminal/controllers/terminal.js'
import { terminalBrowserController } from '~/src/server/services/terminal/controllers/terminal-browser.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export const serviceTerminal = [
  {
    method: 'GET',
    path: '/services/{serviceId}/terminal',
    ...terminalController
  },
  {
    method: 'POST',
    path: '/services/{serviceId}/terminal/{environment}',
    ...launchTerminalController
  },
  {
    method: 'GET',
    path: '/services/{serviceId}/terminal/{environment}/{token}',
    ...terminalBrowserController
  }
].map(serviceOwnerOrAdminUserScope)
