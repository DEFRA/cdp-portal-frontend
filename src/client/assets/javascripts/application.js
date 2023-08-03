import { initAll } from 'govuk-frontend'

import { initModule } from '~/src/client/common/helpers/init-module'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { button } from '~/src/server/common/components/button/button'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { fetchVersions } from '~/src/client/common/helpers/fetch-versions'
import { fetchMemory } from '~/src/client/common/helpers/fetch-memory'
import { errorMessages } from '~/src/client/common/helpers/error-messages'
import { protectForm } from '~/src/client/common/helpers/protect-form'
import { search } from '~/src/server/common/components/search/search'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'
import { addHistoryListener } from '~/src/client/common/helpers/xhr'
import { tabs } from '~/src/server/common/components/tabs/tabs'

import '../stylesheets/application.scss'

initAll()

// Select controller functions
window.fetchVersions = fetchVersions
window.fetchMemory = fetchMemory

// Setup Xhr history listener
addHistoryListener()

// Create service repository name readout
initModule('repository-name', readOut)

// Form submit buttons with loaders. Create and Deploy service
initModule('app-button', button)

// Deploy service form. Choose deployment version select
initModule('select-controller', populateSelectOptions)

// Remove server-side error messages on element blur
initModule('app-form', errorMessages)

// Add UX friction to editing inputs on a protected form
initModule('protected-inputs', protectForm, '*=')

// Search
initModule('app-search', search)

// Auto submit xhr functionality
initModule('auto-submit', autoSubmit)

// Tab functionality
initModule('app-tabs', tabs)
