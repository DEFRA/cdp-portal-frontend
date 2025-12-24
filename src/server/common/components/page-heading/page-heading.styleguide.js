export const pageHeadingStyleguide = {
  name: 'page-heading',
  title: 'Page Heading',
  description: 'Consistent page title with optional caption, intro, and CTA',
  category: 'navigation',
  macro: {
    path: 'page-heading/macro.njk',
    name: 'appPageHeading'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Main heading text'
    },
    {
      name: 'caption',
      type: 'string',
      required: false,
      description: 'Caption text above heading'
    },
    {
      name: 'intro',
      type: 'string',
      required: false,
      description: 'Introduction paragraph (supports HTML)'
    },
    {
      name: 'cta.text',
      type: 'string',
      required: false,
      description: 'Call-to-action link text'
    },
    {
      name: 'cta.href',
      type: 'string',
      required: false,
      description: 'Call-to-action link URL'
    }
  ],
  examples: [
    {
      title: 'Basic heading',
      params: {
        caption: 'Service',
        text: 'CDP Portal Frontend',
        intro: 'The frontend for the Core Delivery Platform'
      }
    },
    {
      title: 'Heading with intro',
      params: {
        text: 'Deploy Service',
        intro: 'Deploy a service to an environment'
      }
    },
    {
      title: 'Heading with CTA',
      params: {
        text: 'Repositories',
        intro: 'Browse all repositories on the platform',
        cta: {
          text: 'Create a repository',
          href: '/create/repository'
        }
      }
    }
  ]
}
