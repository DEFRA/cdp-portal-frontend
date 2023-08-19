import { initAll } from 'govuk-frontend'

import { tabs } from '~/src/server/common/components/tabs/tabs'
import { initModule } from '~/src/client/common/helpers/init-module'
import { search } from '~/src/server/common/components/search/search'
import { button } from '~/src/server/common/components/button/button'
import { protectForm } from '~/src/client/common/helpers/protect-form'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { errorMessages } from '~/src/client/common/helpers/error-messages'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'
import { addHistoryListener } from '~/src/client/common/helpers/xhr'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { autocompleteSearch } from '~/src/server/common/components/autocomplete-search/autocomplete-search'
import { autocompleteDropdown } from '~/src/server/common/components/autocomplete-dropdown/autocomplete-dropdown'
import {
  fetchVersions,
  fetchMemory
} from '~/src/client/common/helpers/fetchers/select'

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
initModule('app-form-errors', errorMessages, '*=')

// Add UX friction to editing inputs on a protected form
initModule('protected-inputs', protectForm, '*=')

// Autocomplete Search
initModule('app-autocomplete-search', autocompleteSearch)

// Search
initModule('app-search', search)

// Autocomplete Dropdown
initModule('app-autocomplete-dropdown', autocompleteDropdown)

// Auto submit xhr functionality
initModule('auto-submit', autoSubmit, '*=')

// Tab functionality
initModule('app-tabs', tabs)

// Params to hidden inputs
initModule('app-params', paramsToHiddenInputs, '*=')
