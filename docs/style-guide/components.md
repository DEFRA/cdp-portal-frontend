# Components

Custom components extend GOV.UK Frontend for CDP-specific functionality.

- [Component Structure](#component-structure)
- [Component Categories](#component-categories)
  - [Forms & Inputs](#forms--inputs)
  - [Display](#display)
  - [Navigation](#navigation)
  - [Layout](#layout)
  - [Data Display](#data-display)
- [Usage Examples](#usage-examples)
  - [Button with loader](#button-with-loader)
  - [Autocomplete](#autocomplete)
  - [Tag](#tag)
  - [Entity table](#entity-table)
- [Creating a New Component](#creating-a-new-component)
  - [Template pattern](#template-pattern)
- [Live Style Guide](#live-style-guide)

## Component Structure

Each component lives in `src/server/common/components/`:

```
button/
├── template.njk          # Nunjucks macro
├── button.scss           # Styles
├── button.js             # Client JavaScript (optional)
├── button.test.js        # Unit tests
└── template.test.js      # Template tests
```

## Component Categories

### Forms & Inputs

| Component         | Description                         |
| ----------------- | ----------------------------------- |
| `appButton`       | Enhanced button with loader support |
| `appAutocomplete` | Searchable select with async data   |
| `appSearch`       | Search input with submit            |
| `appFilters`      | Filter controls for lists           |
| `appSelect`       | Enhanced select dropdown            |

### Display

| Component    | Description                      |
| ------------ | -------------------------------- |
| `appTag`     | Status tags with optional loader |
| `appBanner`  | Alert and notification banners   |
| `appLoader`  | Loading spinner                  |
| `appInfo`    | Information panel                |
| `appWarning` | Warning message panel            |
| `appCopy`    | Copy-to-clipboard                |
| `appTime`    | Relative time display            |

### Navigation

| Component           | Description              |
| ------------------- | ------------------------ |
| `appBreadcrumbs`    | Breadcrumb navigation    |
| `appTabs`           | Tabbed interface         |
| `appStepNavigation` | Multi-step form progress |
| `appPageHeading`    | Consistent page title    |

### Layout

| Component      | Description        |
| -------------- | ------------------ |
| `appSplitPane` | Two-column layout  |
| `appDetails`   | Expandable details |

### Data Display

| Component           | Description    |
| ------------------- | -------------- |
| `appEntity`         | Entity card    |
| `appEntityTable`    | Data table     |
| `appEntityDataList` | Key-value list |

## Usage Examples

### Button with loader

```nunjucks
{{ appButton({
  text: "Deploy",
  loader: {
    name: "deploy-loader"
  }
}) }}
```

### Autocomplete

```nunjucks
{{ appAutocomplete({
  id: "service-select",
  name: "service",
  label: { text: "Select a service" },
  dataFetcher: "/api/services/suggestions"
}) }}
```

### Tag

```nunjucks
{{ appTag({
  text: "Running",
  classes: "govuk-tag--green"
}) }}

{{ appTag({
  text: "Deploying",
  isLoading: true,
  classes: "app-tag--purple"
}) }}
```

### Entity table

```nunjucks
{{ appEntityTable({
  headers: [
    { id: "name", text: "Name" },
    { id: "status", text: "Status" }
  ],
  rows: services,
  noResult: "No services found"
}) }}
```

## Creating a New Component

1. Create directory in `src/server/common/components/`
2. Add `template.njk` with macro
3. Add styles in `component.scss`
4. Add client JS if needed
5. Write tests
6. Document in component registry

### Template pattern

```nunjucks
{% macro appMyComponent(params) %}
  {%- set classes = "app-my-component " + (params.classes | default("")) -%}

  <div class="{{ classes }}"
    {%- if params.attributes %}
      {%- for key, value in params.attributes %} {{ key }}="{{ value }}"{% endfor -%}
    {%- endif %}>
    {{ params.content | safe }}
  </div>
{% endmacro %}
```

## Live Style Guide

Access the interactive style guide at `/style-guide` (admin users, development only) to see all components with live
examples.
