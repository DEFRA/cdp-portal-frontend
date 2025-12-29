# Blog

Layout component for displaying blog articles with navigation sidebar and table of contents.

## Usage

```nunjucks
{{ appBlog({
  nav: navHtml,
  content: articleContentHtml,
  toc: tableOfContentsHtml
}) }}
```

## Parameters

| Name        | Type    | Required | Description                            |
| ----------- | ------- | -------- | -------------------------------------- |
| `nav`       | string  | Yes      | HTML for the navigation sidebar        |
| `content`   | string  | Yes      | HTML for the main article content      |
| `toc`       | string  | No       | HTML for the table of contents sidebar |
| `isInverse` | boolean | No       | Apply inverse (dark) heading style     |

## Layout

The component creates a three-column layout:

1. **Navigation sidebar** - List of blog posts
2. **Main content** - The article body (rendered as markdown)
3. **Table of contents** - Optional "In this article" navigation

## Notes

- Content is rendered within an `app-markdown` article wrapper
- The `nav`, `content`, and `toc` parameters accept raw HTML (typically rendered markdown)
- Used for the CDP platform blog/announcements section
