# Documentation

Layout component for displaying documentation pages with navigation and table of contents.

## Usage

```nunjucks
{{ appDocumentation({
  nav: navigationHtml,
  content: markdownContentHtml,
  toc: tableOfContentsHtml,
  documentationPath: "guides/getting-started.md"
}) }}
```

## Parameters

| Name                | Type   | Required | Description                                   |
| ------------------- | ------ | -------- | --------------------------------------------- |
| `nav`               | string | Yes      | HTML for the navigation sidebar               |
| `content`           | string | Yes      | HTML for the main documentation content       |
| `toc`               | string | No       | HTML for the table of contents sidebar        |
| `documentationPath` | string | Yes      | Path to source file in cdp-documentation repo |

## Layout

The component creates a three-column layout:

1. **Navigation sidebar** - Documentation navigation tree
2. **Main content** - The documentation body (rendered markdown)
3. **Table of contents** - "On this page" navigation for current document

## Notes

- Content is rendered within an `app-markdown` wrapper for styling
- Includes a footer linking to the source file in the cdp-documentation GitHub repository
- The `nav`, `content`, and `toc` parameters accept raw HTML (typically rendered from markdown)
