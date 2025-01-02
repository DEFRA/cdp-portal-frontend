import { initAll } from 'govuk-frontend'

import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete.js'
import { AutocompleteAdvanced } from '~/src/server/common/components/autocomplete/autocomplete-advanced.js'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit.js'
import { availability } from '~/src/server/common/components/availability/availability.js'
import { banner } from '~/src/server/common/components/banner/banner.js'
import { button } from '~/src/server/common/components/button/button.js'
import { clearFilters } from '~/src/client/common/helpers/fetch/filters/clear-filters.js'
import { errorMessages } from '~/src/client/common/helpers/error-messages.js'
import { fetchIsNameAvailable } from '~/src/client/common/helpers/fetch/create/fetch-is-name-available.js'
import { fetchMemory } from '~/src/client/common/helpers/fetch/select/index.js'
import { fetchVersions } from '~/src/client/common/helpers/fetch/autocomplete/index.js'
import { filters } from '~/src/server/common/components/filters/filters.js'
import { initClass } from '~/src/client/common/helpers/init-class.js'
import { initModule } from '~/src/client/common/helpers/init-module.js'
import { inputAssistant } from '~/src/server/common/components/input-assistant/input-assistant.js'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs.js'
import { poll } from '~/src/client/common/helpers/poll.js'
import { populateAutocompleteSuggestions } from '~/src/client/common/helpers/populate-autocomplete-suggestions.js'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options.js'
import { protectForm } from '~/src/client/common/helpers/protect-form/index.js'
import { search } from '~/src/server/common/components/search/search.js'
import { tabs } from '~/src/server/common/components/tabs/tabs.js'
import { xhrSubscriber } from '~/src/server/common/components/xhr-subscriber/xhr-subscriber.js'
import { resizeIframe } from '~/src/client/common/helpers/resize-iframe.js'

initAll()

// ClientSide CDP namespace
window.cdp = window.cdp || {}

// Helper functions
window.cdp.fetchVersions = fetchVersions
window.cdp.fetchMemory = fetchMemory
window.cdp.fetchIsNameAvailable = fetchIsNameAvailable
window.cdp.clearFilters = clearFilters
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
