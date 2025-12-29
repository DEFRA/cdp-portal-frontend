import { scopes } from '@defra/cdp-validation-kit'

/**
 * Icon registry for the Style Guide icons page.
 * Lists all available icons with their macro names and descriptions.
 */
const iconRegistry = [
  // Status icons
  {
    name: 'alert-icon',
    macro: 'appAlertIcon',
    description: 'Alert notification'
  },
  {
    name: 'complete-icon',
    macro: 'appCompleteIcon',
    description: 'Completion status'
  },
  { name: 'error-icon', macro: 'appErrorIcon', description: 'Error status' },
  {
    name: 'pending-icon',
    macro: 'appPendingIcon',
    description: 'Pending status'
  },
  { name: 'tick-icon', macro: 'appTickIcon', description: 'Success tick' },
  {
    name: 'warning-icon',
    macro: 'appWarningIcon',
    description: 'Warning indicator'
  },

  // Instance status icons
  {
    name: 'instance-icon',
    macro: 'appInstanceIcon',
    description: 'Running instance'
  },
  {
    name: 'instance-failed-icon',
    macro: 'appInstanceFailedIcon',
    description: 'Failed instance'
  },
  {
    name: 'instance-pending-icon',
    macro: 'appInstancePendingIcon',
    description: 'Pending instance'
  },
  {
    name: 'instance-stopped-icon',
    macro: 'appInstanceStoppedIcon',
    description: 'Stopped instance'
  },
  {
    name: 'instance-success-icon',
    macro: 'appInstanceSuccessIcon',
    description: 'Successful instance'
  },
  {
    name: 'instance-undeployed-icon',
    macro: 'appInstanceUndeployedIcon',
    description: 'Undeployed instance'
  },

  // UI icons
  { name: 'cancel-icon', macro: 'appCancelIcon', description: 'Cancel action' },
  {
    name: 'chevron-icon',
    macro: 'appChevronIcon',
    description: 'Navigation chevron'
  },
  { name: 'copy-icon', macro: 'appCopyIcon', description: 'Copy to clipboard' },
  { name: 'help-icon', macro: 'appHelpIcon', description: 'Help information' },
  { name: 'info-icon', macro: 'appInfoIcon', description: 'Information' },
  {
    name: 'question-icon',
    macro: 'appQuestionIcon',
    description: 'Question or unknown'
  },
  { name: 'search-icon', macro: 'appSearchIcon', description: 'Search action' },
  {
    name: 'star-icon',
    macro: 'appStarIcon',
    description: 'Favourite or owned'
  },
  { name: 'user-icon', macro: 'appUserIcon', description: 'User profile' },

  // Service icons
  { name: 'block-icon', macro: 'appBlockIcon', description: 'Service block' },
  { name: 'database-icon', macro: 'appDatabaseIcon', description: 'Database' },
  {
    name: 'github-icon',
    macro: 'appGithubIcon',
    description: 'GitHub repository'
  },
  {
    name: 'internal-icon',
    macro: 'appInternalIcon',
    description: 'Internal service'
  },
  {
    name: 'schema-icon',
    macro: 'appSchemaIcon',
    description: 'Database schema'
  },
  {
    name: 'terminal-icon',
    macro: 'appTerminalIcon',
    description: 'Terminal access'
  },

  // Brand icons
  { name: 'aws-icon', macro: 'appAwsIcon', description: 'AWS services' },
  { name: 'curl-icon', macro: 'appCurlIcon', description: 'Curl tool' },
  { name: 'mongo-db-icon', macro: 'appMongoDbIcon', description: 'MongoDB' },
  { name: 'redis-icon', macro: 'appRedisIcon', description: 'Redis' }
]

const iconSizes = [
  { class: 'app-icon', size: '40px', description: 'Default size' },
  { class: 'app-icon--medium', size: '32px', description: 'Medium' },
  { class: 'app-icon--small', size: '24px', description: 'Small' },
  { class: 'app-icon--tiny', size: '20px', description: 'Tiny' },
  { class: 'app-icon--minute', size: '18px', description: 'Minute' },
  { class: 'app-icon--minuscule', size: '16px', description: 'Minuscule' }
]

const iconColors = [
  { class: 'app-icon--fill-blue', description: 'Blue fill' },
  { class: 'app-icon--fill-red', description: 'Red fill' }
]

const iconsRoute = {
  options: {
    id: 'style-guide/icons',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    return h.view('style-guide/views/icons', {
      pageTitle: 'Icons - Style Guide',
      icons: iconRegistry,
      iconSizes,
      iconColors,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: 'Icons' }
      ]
    })
  }
}

export { iconsRoute, iconRegistry }
