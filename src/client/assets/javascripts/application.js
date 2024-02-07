import { initAll } from 'govuk-frontend'

import { initModule } from '~/src/client/common/helpers/init-module'
import { availability } from '~/src/server/common/components/availability/availability'
import { button } from '~/src/server/common/components/button/button'
import { search } from '~/src/server/common/components/search/search'
import { protectForm } from '~/src/client/common/helpers/protect-form'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { errorMessages } from '~/src/client/common/helpers/error-messages'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'
import { poll } from '~/src/client/common/helpers/poll'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { autocompleteSearch } from '~/src/server/common/components/autocomplete-search/autocomplete-search'
import { autocompleteDropdown } from '~/src/server/common/components/autocomplete-dropdown/autocomplete-dropdown'
import { fetchIsNameAvailable } from '~/src/client/common/helpers/fetch/create/fetch-is-name-available'
import {
  fetchVersions,
  fetchMemory
} from '~/src/client/common/helpers/fetch/select'

import '../stylesheets/application.scss'

import '../images/favicon.ico'
import '../images/favicon.svg'
import '../images/govuk-icon-180.png'
import '../images/govuk-icon-192.png'
import '../images/govuk-icon-512.png'
import '../images/govuk-icon-mask.svg'

initAll()

// ClientSide namespace
window.cdp = {}

// Helper functions
window.cdp.fetchVersions = fetchVersions
window.cdp.fetchMemory = fetchMemory
window.cdp.fetchIsNameAvailable = fetchIsNameAvailable

// Create multistep form flow, repository name readout
initModule('app-read-out', readOut, '*=')

// Create multistep form flow, repository name availability
initModule('app-availability', availability, '*=')

// Form submit buttons with loaders. Create and Deploy service
initModule('app-button', button)

// Deploy service form. Choose deployment version select
initModule('app-select-controller', populateSelectOptions)

// Remove server-side error messages on element blur
initModule('app-form-errors', errorMessages, '*=')

// Add UX friction to editing inputs on a protected form
initModule('app-protected-inputs', protectForm, '*=')

// Autocomplete Search
initModule('app-autocomplete-search', autocompleteSearch)

// Search
initModule('app-search', search)

// Autocomplete Dropdown
initModule('app-autocomplete-dropdown', autocompleteDropdown)

// Auto submit xhr functionality
initModule('auto-submit', autoSubmit, '*=')

// Params to hidden inputs
initModule('app-params', paramsToHiddenInputs, '*=')

// Poll
initModule('app-poll', poll)
