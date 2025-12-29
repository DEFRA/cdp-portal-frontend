# SASS & CSS

The CDP Portal Frontend uses SASS for styling, following GOV.UK Frontend conventions with BEM naming.

- [File Structure](#file-structure)
- [BEM Naming Convention](#bem-naming-convention)
- [Using GOV.UK Variables](#using-govuk-variables)
- [Common Patterns](#common-patterns)
  - [Responsive layouts](#responsive-layouts)
  - [Tag colours](#tag-colours)
  - [Loading states](#loading-states)
- [Build Process](#build-process)

## File Structure

```
src/client/
├── stylesheets/
│   └── application.scss    # Main entry point
└── common/
    └── helpers/            # Shared SASS utilities
```

Component styles are co-located:

```
src/server/common/components/
└── button/
    ├── button.scss         # Component styles
    ├── template.njk        # Component template
    └── button.js           # Client-side JavaScript
```

## BEM Naming Convention

Use Block-Element-Modifier pattern with `app-` prefix for custom components:

```scss
// Block
.app-loader {
  display: inline-block;

  // Element
  &__spinner {
    animation: spin 1s linear infinite;
  }

  // Modifier
  &--small {
    width: 16px;
    height: 16px;
  }
}
```

## Using GOV.UK Variables

Import GOV.UK settings for consistent theming:

```scss
// Use GOV.UK colour function
.app-status--success {
  color: govuk-colour('green');
}

// Use spacing scale
.app-card {
  padding: govuk-spacing(4);
  margin-bottom: govuk-spacing(6);
}

// Use typography mixins
.app-heading {
  @include govuk-font($size: 24, $weight: bold);
}
```

## Common Patterns

### Responsive layouts

```scss
.app-grid {
  @include govuk-media-query($from: tablet) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: govuk-spacing(4);
  }
}
```

### Tag colours

Custom tag colours extend GOV.UK tag:

```scss
.app-tag--purple {
  background-color: #4c2c92;
  color: govuk-colour('white');
}
```

### Loading states

```scss
.app-loading {
  opacity: 0.6;
  pointer-events: none;
}
```

## Build Process

SASS is compiled via Webpack in `webpack.config.js`. The build:

1. Compiles SCSS to CSS
2. Adds vendor prefixes via autoprefixer
3. Minifies in production
