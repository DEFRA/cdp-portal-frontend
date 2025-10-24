import { Marked } from 'marked'

import { blogNavLinkExtension } from '../extensions/blog-nav-link.js'
import { fetchMarkdown } from '../../../documentation/helpers/s3-file-handler.js'
import { extractHrefs } from '../../../documentation/helpers/markdown/build-page-html.js'

/**
 * Build the blog article navigation. Highlight link with matching blogPath as the currently viewed article
 * @param {Request} request
 * @param {string} bucket
 * @param {string} blogPath
 * @returns {Promise<string>}
 */
async function buildArticleNav(request, bucket, articlePath) {
  const navMarkdown = await fetchMarkdown(request, bucket, 'blog/blog-nav.md')
  const navLink = blogNavLinkExtension(`/blog/${articlePath}`)
  const navMarked = new Marked({ gfm: true })

  navMarked.use({ extensions: [navLink] })

  return navMarked.parse(navMarkdown)
}

/**
 * Build the blog navigation on the home page. This serves the latest article and highlights the matching link
 * in the nav. Returns the nav hrefs to the consumer to be used to build the article previews.
 * @param {Request} request
 * @param {string} bucket
 * @returns {Promise<{nav: Promise<string> | string, navHrefs: []}>}
 */
async function buildBlogNav(request, bucket) {
  const navMarkdown = await fetchMarkdown(request, bucket, 'blog/blog-nav.md')
  const hrefs = extractHrefs(navMarkdown)
  const navLink = blogNavLinkExtension()
  const navMarked = new Marked({ gfm: true })

  navMarked.use({ extensions: [navLink] })

  return {
    nav: navMarked.parse(navMarkdown),
    navHrefs: hrefs
  }
}

export { buildBlogNav, buildArticleNav }

/**
 * @import {Request} from '@hapi/hapi'
 */
