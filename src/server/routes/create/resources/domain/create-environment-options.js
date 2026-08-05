import { formatText } from '#config/nunjucks/filters/filters.js'
import { orderedEnvironments } from '@defra/cdp-validation-kit'

export default [
  { value: 'tenants', text: 'Tenant environments' },
  { value: 'platform', text: 'Platform environments' },
  { value: 'all', text: 'All environments' },
  ...orderedEnvironments.map((env) => ({
    value: env,
    text: `${formatText(env)} only`
  }))
]
