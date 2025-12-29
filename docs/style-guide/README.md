# CDP Portal Frontend Style Guide

This style guide documents the design patterns, components, and systems used in the CDP Portal Frontend.

- [Live Style Guide](#live-style-guide)
- [Systems](#systems)
- [External Resources](#external-resources)
- [Directory Structure](#directory-structure)
  - [Feature-specific Common Folders](#feature-specific-common-folders)
- [Quick Start](#quick-start)
  - [Using a GOV.UK component](#using-a-govuk-component)
  - [Using a custom component](#using-a-custom-component)
  - [Adding styles](#adding-styles)

## Live Style Guide

Admin users can access a live style guide at `/style-guide` which shows interactive examples of all custom components.

## Systems

- [SASS & CSS](./sass.md) - Styling with BEM naming conventions
- [Nunjucks Templates](./nunjucks.md) - Template patterns and macros
- [Client-side JavaScript](./client-javascript.md) - Browser JavaScript patterns
- [Components](./components.md) - Custom component library

## External Resources

- [GOV.UK Design System](https://design-system.service.gov.uk/) - Core design patterns
- [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) - Component library
- [Defra Software Standards](https://defra.github.io/software-development-standards/) - Development guidelines

## Directory Structure

```
src/
├── server/
│   ├── common/
│   │   ├── components/     # Shared custom Nunjucks components
│   │   └── templates/      # Page layouts and partials
│   └── <feature>/
│       └── common/         # Feature-specific components (optional)
│           ├── components/ # Feature-specific Nunjucks components
│           └── partials/   # Feature-specific template partials
└── client/
    ├── javascripts/        # Client-side JavaScript entry
    └── common/             # Shared client utilities
```

### Feature-specific Common Folders

Features can have their own `common` folder for components and partials that are only used within that feature area.
Examples:

- `src/server/services/common/` - Components specific to the services section
- `src/server/running-services/common/` - Components specific to running services

This pattern keeps feature-specific code co-located while maintaining separation from globally shared components in
`src/server/common/`.

## Quick Start

### Using a GOV.UK component

```nunjucks
{{ govukButton({
  text: "Continue",
  type: "submit"
}) }}
```

### Using a custom component

```nunjucks
{{ appButton({
  text: "Deploy",
  loader: { name: "deploy-loader" }
}) }}
```

### Adding styles

```scss
// Use BEM naming: block__element--modifier
.app-my-component {
  &__title {
    font-weight: bold;
  }

  &--highlighted {
    background-color: govuk-colour('yellow');
  }
}
```
