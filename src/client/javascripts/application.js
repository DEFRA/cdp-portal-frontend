import { initAll } from 'govuk-frontend'
import mermaid from 'mermaid'

import { Autocomplete } from '../../server/common/components/autocomplete/autocomplete.js'
import { AutocompleteAdvanced } from '../../server/common/components/autocomplete/autocomplete-advanced.js'
import { AutocompleteSearch } from '../../server/common/components/autocomplete/autocomplete-search.js'
import { autoSubmit } from '../common/helpers/auto-submit.js'
import { availability } from '../../server/common/components/availability/availability.js'
import { banner } from '../../server/common/components/banner/banner.js'
import { button } from '../../server/common/components/button/button.js'
import { copy } from '../../server/common/components/copy/copy.js'
import { clearFilters } from '../common/helpers/fetch/filters/clear-filters.js'
import { errorMessages } from '../common/helpers/error-messages.js'
import { fetchIsNameAvailable } from '../common/helpers/fetch/create/fetch-is-name-available.js'
import { fetchMemory } from '../common/helpers/fetch/select/fetch-memory.js'
import { fetchDocsSearchSuggestions } from '../common/helpers/fetch/autocomplete/fetch-docs-search-suggestions.js'
import { fetchVersions } from '../common/helpers/fetch/autocomplete/fetch-versions.js'
import { focusOnErrorMessage } from '../common/helpers/focus-on-error-message.js'
import { filters } from '../../server/common/components/filters/filters.js'
import { inputAssistant } from '../../server/common/components/input-assistant/input-assistant.js'
import { paramsToHiddenInputs } from '../common/helpers/params-to-hidden-inputs.js'
import { poll } from '../common/helpers/poll.js'
import { populateSelectOptions } from '../common/helpers/populate-select-options.js'
import { protectForm } from '../common/helpers/protect-form/index.js'
import { search } from '../../server/common/components/search/search.js'
import { tabs } from '../../server/common/components/tabs/tabs.js'
import { xhrSubscriber } from '../../server/common/components/xhr-subscriber/xhr-subscriber.js'
import { resizeIframe } from '../common/helpers/resize-iframe.js'
import { fetchMigrations } from '../common/helpers/fetch/autocomplete/fetch-migrations.js'
import { initClass, initModules, initModule } from '../common/helpers/init.js'
import { fetchEnvironments } from '../common/helpers/fetch/autocomplete/fetch-environments.js'

initAll()
mermaid.initialize({ startOnLoad: true })

// ClientSide CDP namespace
window.cdp = window.cdp || {}

// Helper functions
window.cdp.fetchVersions = fetchVersions
window.cdp.fetchEnvironments = fetchEnvironments
window.cdp.fetchMigrations = fetchMigrations
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

// Copy button
initModules('app-copy', copy)

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
