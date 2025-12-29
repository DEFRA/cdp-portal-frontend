export const buttonStyleguide = {
  name: 'button',
  title: 'Button',
  description:
    'Enhanced GOV.UK button with loader support. Use standard GOV.UK button if loader is not needed.',
  category: 'form',
  macro: {
    path: 'button/macro.njk',
    name: 'appButton'
  },
  params: [
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Button text'
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Form field name'
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Form field value'
    },
    {
      name: 'loader.name',
      type: 'string',
      required: false,
      description: 'Loader identifier for JavaScript control'
    },
    {
      name: 'loader.hasSiblingButton',
      type: 'boolean',
      required: false,
      description: 'Adjusts loader position when next to another button'
    }
  ],
  examples: [
    {
      title: 'Basic button',
      params: { text: 'Submit' }
    },
    {
      title: 'Button with loader',
      params: {
        text: 'Deploy',
        loader: { name: 'deploy-loader' }
      }
    }
  ]
}
