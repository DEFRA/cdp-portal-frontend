# Tag

## Status Colours

Use GOV.UK tag colour modifiers:

```nunjucks
{# Success #}
{{ appTag({ text: "Running", classes: "govuk-tag--green" }) }}

{# Warning #}
{{ appTag({ text: "Pending", classes: "govuk-tag--yellow" }) }}

{# Error #}
{{ appTag({ text: "Failed", classes: "govuk-tag--red" }) }}

{# Info #}
{{ appTag({ text: "Draft", classes: "govuk-tag--blue" }) }}

{# Neutral #}
{{ appTag({ text: "Inactive", classes: "govuk-tag--grey" }) }}
```

## Custom Colours

Use app-specific colours:

```nunjucks
{# Purple for in-progress #}
{{ appTag({ text: "Deploying", classes: "app-tag--purple" }) }}
```

## Common Patterns

### Deployment status

```nunjucks
{% set statusClass = {
  "running": "govuk-tag--green",
  "pending": "govuk-tag--yellow",
  "failed": "govuk-tag--red",
  "stopped": "govuk-tag--grey"
}[status] %}

{{ appTag({
  text: status | capitalize,
  classes: statusClass
}) }}
```
