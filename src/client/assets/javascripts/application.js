import { initAll } from 'govuk-frontend'

import { initModule } from '~/src/client/common/helpers/init-module'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { button } from '~/src/server/common/components/button/button'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { fetchVersions } from '~/src/client/common/helpers/fetch-versions'

import '../stylesheets/application.scss'

initAll()

window.fetchVersions = fetchVersions

// Create service repository name readout
initModule('repository-name', readOut)

// Form submit buttons with loaders. Create and Deploy service
initModule('app-button', button)

// Deploy service form. Choose deployment version select
initModule('select-controller', populateSelectOptions)
