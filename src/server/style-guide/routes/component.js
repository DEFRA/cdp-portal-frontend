import Boom from '@hapi/boom'

import { findComponent } from '../helpers/component-registry.js'
import { scopes } from '@defra/cdp-validation-kit'
import Joi from 'joi'

const styleGuideComponentRoute = {
  options: {
    id: 'style-guide/{componentName}',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    },
    validate: {
      params: Joi.object({
        componentName: Joi.string().required()
      })
    }
  },
  handler: (request, h) => {
    const { componentName } = request.params
    const component = findComponent(componentName)

    if (!component) {
      throw Boom.notFound(`Component '${componentName}' not found`)
    }

    return h.view('style-guide/views/component', {
      pageTitle: `${component.title} - Style Guide`,
      component,
      breadcrumbs: [
        { text: 'Style Guide', href: '/style-guide' },
        { text: component.title }
      ]
    })
  }
}

export { styleGuideComponentRoute }
