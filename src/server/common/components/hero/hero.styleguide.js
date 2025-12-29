export const heroStyleguide = {
  name: 'hero',
  title: 'Hero',
  description: 'Hero banner for landing pages',
  category: 'layout',
  macro: {
    path: 'hero/macro.njk',
    name: 'appHero'
  },
  params: [
    {
      name: 'heading',
      type: 'string',
      required: true,
      description: 'Hero heading text'
    },
    {
      name: 'lead.html',
      type: 'string',
      required: true,
      description: 'Lead paragraph HTML'
    },
    {
      name: 'secondary.html',
      type: 'string',
      required: false,
      description: 'Secondary content HTML'
    },
    {
      name: 'aside.html',
      type: 'string',
      required: false,
      description: 'Aside/image area HTML'
    }
  ],
  examples: [
    {
      title: 'Basic hero',
      params: {
        heading: 'Core Delivery Platform',
        lead: {
          html: 'Build, deploy and manage services on DEFRA infrastructure'
        }
      }
    }
  ]
}
