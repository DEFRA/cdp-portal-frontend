# Nunjucks Templates

The CDP Portal Frontend uses Nunjucks for server-side templating with GOV.UK Frontend macros.

- [Template Structure](#template-structure)
- [Creating a Page](#creating-a-page)
- [Using GOV.UK Components](#using-govuk-components)
- [Using Custom Components](#using-custom-components)
- [Macros and Components](#macros-and-components)
  - [Creating a component](#creating-a-component)
  - [Component with caller](#component-with-caller)
- [Context Variables](#context-variables)
- [Global Context](#global-context)

## Template Structure

```
src/server/
├── common/
│   ├── templates/
│   │   └── layouts/
│   │       └── page.njk        # Main page layout
│   └── components/
│       └── button/
│           └── template.njk    # Component template
└── services/
    └── views/
        └── services-list.njk   # Page view
```

## Creating a Page

Extend the base layout:

```nunjucks
{% extends "layouts/page.njk" %}

{% block content %}
  {{ appPageHeading({
    text: "Page Title",
    intro: "Description of the page"
  }) }}

  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <!-- Page content -->
    </div>
  </div>
{% endblock %}
```

## Using GOV.UK Components

GOV.UK Frontend macros are globally available:

```nunjucks
{{ govukButton({
  text: "Submit",
  type: "submit"
}) }}

{{ govukTable({
  head: [{ text: "Name" }, { text: "Status" }],
  rows: [
    [{ text: "Service A" }, { text: "Running" }]
  ]
}) }}

{{ govukInsetText({
  text: "Important information"
}) }}
```

## Using Custom Components

Custom components use `app` prefix:

```nunjucks
{# Button with loader #}
{{ appButton({
  text: "Deploy",
  loader: { name: "deploy-btn" }
}) }}

{# Tag with status #}
{{ appTag({
  text: "Running",
  classes: "govuk-tag--green"
}) }}

{# Entity card #}
{{ appEntity({
  name: "cdp-portal-frontend",
  href: "/services/cdp-portal-frontend",
  kind: "Microservice"
}) }}
```

## Macros and Components

### Creating a component

Component files in `src/server/common/components/`:

```nunjucks
{# template.njk #}
{% macro appMyComponent(params) %}
  <div class="app-my-component {{ params.classes }}">
    {{ params.content }}
  </div>
{% endmacro %}
```

### Component with caller

For components that wrap content:

```nunjucks
{% macro appSplitPane(params) %}
  <div class="app-split-pane">
    {{ caller() }}
  </div>
{% endmacro %}
```

Usage:

```nunjucks
{% call appSplitPane() %}
  <p>Content goes here</p>
{% endcall %}
```

## Context Variables

Controllers pass data to views:

```javascript
// Controller
return h.view('services/views/detail', {
  pageTitle: 'Service Details',
  service: serviceData
})
```

```nunjucks
{# View #}
<h1>{{ pageTitle }}</h1>
<p>{{ service.name }}</p>
```

## Global Context

Available in all templates via `context.js`:

- `assetPath` - Static assets path
- `serviceName` - Application name
- `breadcrumbs` - Navigation breadcrumbs
