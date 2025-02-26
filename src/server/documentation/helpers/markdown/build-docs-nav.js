import { Marked } from 'marked'

import { fetchMarkdown } from '~/src/server/documentation/helpers/s3-file-handler.js'
import { navLinkExtension } from '~/src/server/documentation/helpers/extensions/nav-link.js'

const navMarked = new Marked({ gfm: true })

async function buildDocsNav(request, bucket, documentationPath) {
  const navMarkdown = await fetchMarkdown(request, bucket, 'nav.md')

  const navLink = navLinkExtension(documentationPath)
  navMarked.use({ extensions: [navLink] })

  return navMarked.parse(navMarkdown)
}

export { buildDocsNav }
