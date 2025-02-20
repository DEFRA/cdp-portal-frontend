import { initAll } from 'govuk-frontend'

import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete.js'
import { AutocompleteAdvanced } from '~/src/server/common/components/autocomplete/autocomplete-advanced.js'
import { AutocompleteSearch } from '~/src/server/common/components/autocomplete/autocomplete-search.js'
import { autoSubmit } from '~/src/client/common/helpers/auto-submit.js'
import { availability } from '~/src/server/common/components/availability/availability.js'
import { banner } from '~/src/server/common/components/banner/banner.js'
import { button } from '~/src/server/common/components/button/button.js'
import { clearFilters } from '~/src/client/common/helpers/fetch/filters/clear-filters.js'
import { errorMessages } from '~/src/client/common/helpers/error-messages.js'
import { fetchIsNameAvailable } from '~/src/client/common/helpers/fetch/create/fetch-is-name-available.js'
import { fetchMemory } from '~/src/client/common/helpers/fetch/select/fetch-memory.js'
import { fetchDocsSearchSuggestions } from '~/src/client/common/helpers/fetch/autocomplete/fetch-docs-search-suggestions.js'
import { fetchVersions } from '~/src/client/common/helpers/fetch/autocomplete/fetch-versions.js'
import { focusOnErrorMessage } from '~/src/client/common/helpers/focus-on-error-message.js'
import { filters } from '~/src/server/common/components/filters/filters.js'
import { inputAssistant } from '~/src/server/common/components/input-assistant/input-assistant.js'
import { paramsToHiddenInputs } from '~/src/client/common/helpers/params-to-hidden-inputs.js'
import { poll } from '~/src/client/common/helpers/poll.js'
import { populateSelectOptions } from '~/src/client/common/helpers/populate-select-options.js'
import { protectForm } from '~/src/client/common/helpers/protect-form/index.js'
import { search } from '~/src/server/common/components/search/search.js'
import { tabs } from '~/src/server/common/components/tabs/tabs.js'
import { xhrSubscriber } from '~/src/server/common/components/xhr-subscriber/xhr-subscriber.js'
import { resizeIframe } from '~/src/client/common/helpers/resize-iframe.js'
import {
  initClass,
  initModules,
  initModule
} from '~/src/client/common/helpers/init.js'

initAll()

// ClientSide CDP namespace
window.cdp = window.cdp || {}

// Helper functions
window.cdp.fetchVersions = fetchVersions
window.cdp.fetchDocsSearchSuggestions = fetchDocsSearchSuggestions
window.cdp.fetchMemory = fetchMemory
window.cdp.fetchIsNameAvailable = fetchIsNameAvailable
window.cdp.clearFilters = clearFilters
window.cdp.resizeIframe = resizeIframe

initModules('app-input-assistant', inputAssistant, '*=')

// Create multistep form flow, repository name availability
initModules('app-availability', availability, '*=')

// Form submit buttons with loaders. Create and Deploy service
initModules('app-button', button)

// Populate select options from a separate controller input
initModules('app-select-controller', populateSelectOptions)

// Remove server-side error messages on element blur
initModules('app-form-errors', errorMessages, '*=')

// Focus on first error message on page
initModule('app-error', focusOnErrorMessage)

// Add UX friction to editing inputs on a protected form
initModules('app-protected-inputs', protectForm, '*=')

// Search
initModules('app-search', search)

// Autocomplete
initClass('app-autocomplete', Autocomplete)
initClass('app-autocomplete-advanced', AutocompleteAdvanced)
initClass('app-autocomplete-search', AutocompleteSearch)

// Xhr Container
initModules('app-xhr-subscriber', xhrSubscriber)

// Auto submit xhr functionality
initModules('auto-submit', autoSubmit, '*=')

// Params to hidden inputs
initModules('app-params', paramsToHiddenInputs, '*=')

// Poll
initModules('app-poll', poll)

// Notification banner
initModules('app-notification', banner)

// Filters
initModules('app-filters', filters)

// Tabs
initModules('app-tabs', tabs)
