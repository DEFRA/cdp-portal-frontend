import { renderBlog } from './helpers/render-blog.js'

const homeController = {
  options: {
    id: 'home'
  },
  handler: async (request, h) => {
    try {
      const { html, nav } = await renderBlog(request)
      return h.view('home/views/blog', {
        pageTitle: 'Home',
        content: html,
        breadcrumbs: [],
        documentationPath: '',
        nav
      })
    } catch (e) {
      request.logger.error(e, 'Failed to render blog')
    }
    // Fallback empty blog
    return h.view('home/views/home', {
      pageTitle: 'Home',
      heading: 'Welcome'
    })
  }
}

export { homeController }
