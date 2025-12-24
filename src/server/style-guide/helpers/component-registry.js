/**
 * Component registry for the style guide.
 * Documents all custom components with their params and examples.
 */

// Navigation
import { breadcrumbsStyleguide } from '../../common/components/breadcrumbs/breadcrumbs.styleguide.js'
import { pageHeadingStyleguide } from '../../common/components/page-heading/page-heading.styleguide.js'
import { tabsStyleguide } from '../../common/components/tabs/tabs.styleguide.js'

// Layout
import { detailsStyleguide } from '../../common/components/details/details.styleguide.js'
import { footerStyleguide } from '../../common/components/footer/footer.styleguide.js'
import { heroStyleguide } from '../../common/components/hero/hero.styleguide.js'
import { serviceHeaderStyleguide } from '../../common/components/service-header/service-header.styleguide.js'
import { splitPaneStyleguide } from '../../common/components/split-pane/split-pane.styleguide.js'
import { summaryStyleguide } from '../../common/components/summary/summary.styleguide.js'

// Display
import { vanityUrlStyleguide } from '../../common/components/vanity-url/vanity-url.styleguide.js'
import { announcementStyleguide } from '../../common/components/announcement/announcement.styleguide.js'
import { bannerStyleguide } from '../../common/components/banner/banner.styleguide.js'
import { copyStyleguide } from '../../common/components/copy/copy.styleguide.js'
import { helpStyleguide } from '../../common/components/help/help.styleguide.js'
import { infoStyleguide } from '../../common/components/info/info.styleguide.js'
import { loaderStyleguide } from '../../common/components/loader/loader.styleguide.js'
import { panelStyleguide } from '../../common/components/panel/panel.styleguide.js'
import { progressStyleguide } from '../../common/components/progress/progress.styleguide.js'
import { tagStyleguide } from '../../common/components/tag/tag.styleguide.js'
import { timeStyleguide } from '../../common/components/time/time.styleguide.js'
import { toolTipStyleguide } from '../../common/components/tool-tip/tool-tip.styleguide.js'
import { warningStyleguide } from '../../common/components/warning/warning.styleguide.js'

// Form
import { autocompleteStyleguide } from '../../common/components/autocomplete/autocomplete.styleguide.js'
import { availabilityStyleguide } from '../../common/components/availability/availability.styleguide.js'
import { buttonStyleguide } from '../../common/components/button/button.styleguide.js'
import { filtersStyleguide } from '../../common/components/filters/filters.styleguide.js'
import { inputAssistantStyleguide } from '../../common/components/input-assistant/input-assistant.styleguide.js'
import { namingAdviceStyleguide } from '../../common/components/naming-advice/naming-advice.styleguide.js'
import { searchStyleguide } from '../../common/components/search/search.styleguide.js'
import { stepNavigationStyleguide } from '../../common/components/step-navigation/step-navigation.styleguide.js'

// Data
import { databaseDetailStyleguide } from '../../common/components/database-detail/database-detail.styleguide.js'
import { detailedListStyleguide } from '../../common/components/detailed-list/detailed-list.styleguide.js'
import { entityStyleguide } from '../../common/components/entity/entity.styleguide.js'
import { entityActionsStyleguide } from '../../common/components/entity-actions/entity-actions.styleguide.js'
import { entityDataListStyleguide } from '../../common/components/entity-data-list/entity-data-list.styleguide.js'
import { entityTableStyleguide } from '../../common/components/entity-table/entity-table.styleguide.js'
import { runningServiceStyleguide } from '../../common/components/running-service/running-service.styleguide.js'
import { runningServiceEntityStyleguide } from '../../common/components/running-service-entity/running-service-entity.styleguide.js'
import { searchResultsStyleguide } from '../../common/components/search-results/search-results.styleguide.js'
import { secretsListStyleguide } from '../../common/components/secrets-list/secrets-list.styleguide.js'
import { statusStyleguide } from '../../common/components/status/status.styleguide.js'

const componentRegistry = [
  // Navigation
  breadcrumbsStyleguide,
  pageHeadingStyleguide,
  tabsStyleguide,

  // Layout
  detailsStyleguide,
  footerStyleguide,
  heroStyleguide,
  serviceHeaderStyleguide,
  splitPaneStyleguide,
  summaryStyleguide,
  vanityUrlStyleguide,

  // Display
  announcementStyleguide,
  bannerStyleguide,
  copyStyleguide,
  helpStyleguide,
  infoStyleguide,
  loaderStyleguide,
  panelStyleguide,
  progressStyleguide,
  tagStyleguide,
  timeStyleguide,
  toolTipStyleguide,
  warningStyleguide,

  // Form
  autocompleteStyleguide,
  availabilityStyleguide,
  buttonStyleguide,
  filtersStyleguide,
  inputAssistantStyleguide,
  namingAdviceStyleguide,
  searchStyleguide,
  stepNavigationStyleguide,

  // Data
  databaseDetailStyleguide,
  detailedListStyleguide,
  entityStyleguide,
  entityActionsStyleguide,
  entityDataListStyleguide,
  entityTableStyleguide,
  runningServiceStyleguide,
  runningServiceEntityStyleguide,
  searchResultsStyleguide,
  secretsListStyleguide,
  statusStyleguide
]

/**
 * Category descriptions for the style guide
 */
const categoryDescriptions = {
  navigation: 'Tabs, breadcrumbs, step navigation',
  layout: 'Page structure, split panes, panels',
  display: 'Tags, status indicators, icons',
  form: 'Autocomplete, filters, input assistants',
  data: 'Tables, lists, entity displays'
}

/**
 * Get components grouped by category
 * @returns {Object} Components grouped by category
 */
function getComponentsByCategory() {
  return componentRegistry.reduce((acc, component) => {
    const category = component.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(component)
    return acc
  }, {})
}

/**
 * Find a component by name
 * @param {string} name - Component name
 * @returns {Object|undefined} Component definition
 */
function findComponent(name) {
  return componentRegistry.find((c) => c.name === name)
}

export {
  componentRegistry,
  categoryDescriptions,
  getComponentsByCategory,
  findComponent
}
