export const stepNavigationStyleguide = {
  name: 'step-navigation',
  title: 'Step Navigation',
  description: 'Multi-step progress indicator for wizard-style forms',
  category: 'form',
  macro: {
    path: 'step-navigation/macro.njk',
    name: 'appStepNavigation'
  },
  params: [
    {
      name: 'width',
      type: 'number',
      required: true,
      description: 'Progress percentage (0-100)'
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of step objects with text, isComplete, isCurrent, url'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional container classes'
    }
  ],
  examples: [
    {
      isInverse: true,
      title: 'Start of four step form',
      params: {
        width: 50,
        steps: [
          { text: 'Age', isCurrent: true },
          { text: 'Info' },
          { text: 'Shape' },
          { text: 'Summary' }
        ]
      }
    },
    {
      isInverse: true,
      title: 'Halfway through three step form',
      params: {
        width: 50,
        steps: [
          { text: 'Details', isComplete: true, url: '/create/step-1' },
          { text: 'Configuration', isCurrent: true },
          { text: 'Summary' }
        ]
      }
    },
    {
      isInverse: true,
      title: 'Five step form',
      params: {
        width: 100,
        steps: [
          { text: 'Welcome', isComplete: true, url: '/create/step-1' },
          { text: 'Info', isComplete: true, url: '/create/step-2' },
          { text: 'Consent', isCurrent: true },
          { text: 'Address' },
          { text: 'Summary' }
        ]
      }
    }
  ]
}
