import { initAll } from 'govuk-frontend'

import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete'
import { AutocompleteAdvanced } from '~/src/server/common/components/autocomplete/autocomplete-advanced'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit'
import { availability } from '~/src/server/common/components/availability/availability'
import { banner } from '~/src/server/common/components/banner/banner'
import { button } from '~/src/server/common/components/button/button'
import { clearDeploymentsListFilters } from '~/src/client/common/helpers/fetch/filters'
import { errorMessages } from '~/src/client/common/helpers/error-messages'
import { fetchIsNameAvailable } from '~/src/client/common/helpers/fetch/create/fetch-is-name-available'
import { fetchMemory } from '~/src/client/common/helpers/fetch/select'
import { fetchVersions } from '~/src/client/common/helpers/fetch/autocomplete'
import { filters } from '~/src/server/common/components/filters/filters'
import { initClass } from '~/src/client/common/helpers/init-class'
import { initModule } from '~/src/client/common/helpers/init-module'
import { inputAssistant } from '~/src/server/common/components/input-assistant/input-assistant'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs'
import { poll } from '~/src/client/common/helpers/poll'
import { populateAutocompleteSuggestions } from '~/src/client/common/helpers/populate-autocomplete-suggestions'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options'
import { protectForm } from '~/src/client/common/helpers/protect-form'
import { search } from '~/src/server/common/components/search/search'
import { tabs } from '~/src/server/common/components/tabs/tabs'
import { xhrSubscriber } from '~/src/server/common/components/xhr-subscriber/xhr-subscriber'
import { resizeIframe } from '~/src/client/common/helpers/resize-iframe'

import '../stylesheets/application.scss'

import '../images/favicon.ico'
import '../images/favicon.svg'
import '../images/govuk-icon-180.png'
import '../images/govuk-icon-192.png'
import '../images/govuk-icon-512.png'
import '../images/govuk-icon-mask.svg'

initAll()

// ClientSide CDP namespace
window.cdp = window.cdp || {}

// Helper functions
window.cdp.fetchVersions = fetchVersions
window.cdp.fetchMemory = fetchMemory
window.cdp.fetchIsNameAvailable = fetchIsNameAvailable
window.cdp.clearDeploymentsListFilters = clearDeploymentsListFilters
window.cdp.resizeIframe = resizeIframe

initModule('app-input-assistant', inputAssistant, '*=')

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

// Autocomplete
initClass('app-autocomplete', Autocomplete)
initClass('app-autocomplete-advanced', AutocompleteAdvanced)

// Populate autocomplete from a separate controller input
initModule('app-autocomplete-controller', populateAutocompleteSuggestions)

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

// Filters
initModule('app-filters', filters)

// Tabs
initModule('app-tabs', tabs)
