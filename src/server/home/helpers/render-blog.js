import { config } from '../../../config/config.js'
import { fetchMarkdown } from '../../documentation/helpers/s3-file-handler.js'
import { buildPageHtml } from '../../documentation/helpers/markdown/build-page-html.js'
import { navLinkExtension } from '../../documentation/helpers/extensions/nav-link.js'
import { Marked } from 'marked'

async function renderBlog(request) {
  const bucket = config.get('documentation.bucket')
  const blogMarkdown = await fetchMarkdown(request, bucket, 'blog/blog.md')
  const navMarkdown = await fetchMarkdown(request, bucket, 'blog/blog-nav.md')

  const { html, toc } = await buildPageHtml(request, blogMarkdown)
  const nav = await buildNavHtml(navMarkdown)
  return { html, toc, nav }
}

async function buildNavHtml(nav) {
  const navLink = navLinkExtension()
  const navMarked = new Marked({ gfm: true })
  navMarked.use({ extensions: [navLink] })
  return navMarked.parse(nav)
}

export { renderBlog }
