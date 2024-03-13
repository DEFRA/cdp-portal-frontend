import { initAll } from 'govuk-frontend'

import { initModule } from '~/src/client/common/helpers/init-module'
import { initClass } from '~/src/client/common/helpers/init-class'
import { availability } from '~/src/server/common/components/availability/availability'
import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete'
import { button } from '~/src/server/common/components/button/button'
import { banner } from '~/src/server/common/components/banner/banner'
import { search } from '~/src/server/common/components/search/search'
import { protectForm } from '~/src/client/common/helpers/protect-form'
import { readOut } from '~/src/server/common/components/read-out/read-out'
import { errorMessages } from '~/src/client/common/helpers/error-messages'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'
import { poll } from '~/src/client/common/helpers/poll'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { fetchIsNameAvailable } from '~/src/client/common/helpers/fetch/create/fetch-is-name-available'
import { fetchMemory } from '~/src/client/common/helpers/fetch/select'
import { fetchVersions } from '~/src/client/common/helpers/fetch/autocomplete'
import { populateAutocompleteSuggestions } from '~/src/client/common/helpers/populate-autocomplete-suggestions'
import { xhrSubscriber } from '~/src/server/common/components/xhr-subscriber/xhr-subscriber'

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

// Populate select options from a separate controller input
initModule('app-select-controller', populateSelectOptions)

// Remove server-side error messages on element blur
initModule('app-form-errors', errorMessages, '*=')

// Add UX friction to editing inputs on a protected form
initModule('app-protected-inputs', protectForm, '*=')

// Search
initModule('app-search', search)

// Populate autocomplete from a separate controller input
initModule('app-autocomplete-controller', populateAutocompleteSuggestions)

// Autocomplete
initClass('app-autocomplete', Autocomplete)

// Xhr Container
initModule('app-xhr-subscriber', xhrSubscriber)

// Auto submit xhr functionality
initModule('auto-submit', autoSubmit, '*=')

// Params to hidden inputs
initModule('app-params', paramsToHiddenInputs, '*=')

// Poll
initModule('app-poll', poll)

// Notification banner
initModule('app-notification', banner)
