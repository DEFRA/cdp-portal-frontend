import { config } from '#config/config.js'
import { buildBlogNav } from '#server/home/helpers/markdown/build-blog-nav.js'
import { fetchMarkdown } from '#server/documentation/helpers/s3-file-handler.js'
import {
  buildBlogPageHtml,
  extractTagsFromMarkdown
} from '#server/documentation/helpers/markdown/build-page-html.js'

export const options = {
  id: 'home'
}

export default async function (request, h) {
  const bucket = config.get('documentation.bucket')
  const { nav, navHrefs } = await buildBlogNav(request, bucket)
  const previewArticles = await buildPreviewArticles(request, navHrefs, bucket)

  request.logger.info('Rendering home page')

  return {
    pageTitle: 'Home',
    content: previewArticles,
    nav
  }
}

async function buildPreviewArticles(request, navHrefs, bucket) {
  const quantityPreviewArticles = 8
  const previewArticleLineSize = 6
  const previewArticlesKeys = navHrefs.slice(0, quantityPreviewArticles)

  const removeLeadingSlash = (str) => (str[0] === '/' ? str.slice(1) : str)
  const moreLink = (articlePath) =>
    `<p><a class="app-link app-blog__more-link" href="${articlePath}">Read more</a></p>`

  const previewArticlesMarkdown = await Promise.all(
    previewArticlesKeys.map(async (articleKey) => ({
      markdown: await fetchMarkdown(
        request,
        bucket,
        removeLeadingSlash(articleKey)
      ),
      articleKey
    }))
  )

  const previewArticlesHtml = await Promise.all(
    previewArticlesMarkdown.map(async ({ markdown, articleKey }) => {
      const tags = extractTagsFromMarkdown(markdown)

      const previewMd = markdown
        .replace(/<!--[\s\S]*?-->\n*/g, '') // Remove comments
        .split('\n')
        .slice(0, previewArticleLineSize)
        .join('\n')
      const { html } = await buildBlogPageHtml({
        markdown: previewMd,
        tags,
        articlePath: articleKey,
        withBlogLink: true
      })

      return { html, articleKey }
    })
  )

  return previewArticlesHtml.reduce(
    (htmlPage, { html, articleKey }) =>
      `${htmlPage}<div class="app-blog__preview">${html}${moreLink(articleKey)}</div>`,
    ''
  )
}
