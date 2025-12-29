import { scopes } from '@defra/cdp-validation-kit'

import {
  getComponentsByCategory,
  categoryDescriptions
} from '../helpers/component-registry.js'

const styleGuideRoute = {
  options: {
    id: 'style-guide',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (_request, h) => {
    const componentsByCategory = getComponentsByCategory()

    return h.view('style-guide/views/style-guide', {
      pageTitle: 'Style Guide',
      componentsByCategory,
      categoryDescriptions
    })
  }
}

export { styleGuideRoute }
