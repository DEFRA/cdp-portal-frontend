import { homeRoute } from './routes/home.js'
import { blogAssetsRoute, blogRoute } from './routes/blog.js'

const home = {
  plugin: {
    name: 'home',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          ...homeRoute
        },
        {
          method: 'GET',
          path: '/assets/{assetPath*}',
          ...blogAssetsRoute
        },
        {
          method: 'GET',
          path: '/blog/{articlePath*}',
          ...blogRoute
        }
      ])
    }
  }
}

export { home }
