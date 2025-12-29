import { styleGuideRoute } from './routes/style-guide.js'
import { styleGuideComponentRoute } from './routes/component.js'
import { iconsRoute } from './routes/icons.js'
import { svgsRoute } from './routes/svgs.js'
import { stylesRoute } from './routes/styles.js'
import { stylesLinksRoute } from './routes/styles-links.js'
import { stylesButtonsRoute } from './routes/styles-buttons.js'
import { stylesFormsRoute } from './routes/styles-forms.js'
import { stylesLayoutRoute } from './routes/styles-layout.js'
import { stylesColoursRoute } from './routes/styles-colours.js'
import { stylesTypographyRoute } from './routes/styles-typography.js'
import { provideSubNavigation } from './helpers/provide-sub-navigation.js'

const styleGuide = {
  plugin: {
    name: 'style-guide',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/style-guide',
          ...styleGuideRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles',
          ...stylesRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/links',
          ...stylesLinksRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/buttons',
          ...stylesButtonsRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/forms',
          ...stylesFormsRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/layout',
          ...stylesLayoutRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/typography',
          ...stylesTypographyRoute
        },
        {
          method: 'GET',
          path: '/style-guide/styles/colours',
          ...stylesColoursRoute
        },
        {
          method: 'GET',
          path: '/style-guide/icons',
          ...iconsRoute
        },
        {
          method: 'GET',
          path: '/style-guide/svgs',
          ...svgsRoute
        },
        {
          method: 'GET',
          path: '/style-guide/{componentName}',
          ...styleGuideComponentRoute
        }
      ])
    }
  }
}

export { styleGuide }
