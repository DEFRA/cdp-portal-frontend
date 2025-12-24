# XHR Subscriber

Container for content that updates via XHR polling.

## Usage

```nunjucks
{% call appXhrSubscriber({
  id: "deployment-status",
  subscribeTo: "deployment",
  xhrUrl: "/deployments/123/status"
}) %}
  <p>Current status: Pending</p>
{% endcall %}
```

## Parameters

| Name          | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `id`          | string | Yes      | Unique identifier for content area |
| `subscribeTo` | string | Yes      | Event type to subscribe to         |
| `xhrUrl`      | string | Yes      | URL to fetch updated content       |
| `text`        | string | No       | Plain text content                 |
| `html`        | string | No       | HTML content                       |

## Examples

### Deployment status

```nunjucks
{% call appXhrSubscriber({
  id: "deploy-status",
  subscribeTo: "deployment",
  xhrUrl: "/api/deployments/abc123/partial"
}) %}
  {{ appStatus({
    part: 1,
    name: "Deploying",
    status: { text: "pending", classes: "govuk-tag--yellow" }
  }) }}
{% endcall %}
```

### Service health

```nunjucks
{% call appXhrSubscriber({
  id: "health-check",
  subscribeTo: "health",
  xhrUrl: "/api/services/my-service/health"
}) %}
  <span class="app-health-indicator">Checking...</span>
{% endcall %}
```

### With HTML param

```nunjucks
{{ appXhrSubscriber({
  id: "logs",
  subscribeTo: "logs",
  xhrUrl: "/api/logs/latest",
  html: "<pre>Loading logs...</pre>"
}) }}
```

## Display

Renders:

- Outer `<div>` with data attributes for JavaScript
- Inner `<article>` containing initial content

## Data Attributes

| Attribute           | Description                            |
| ------------------- | -------------------------------------- |
| `data-js`           | "app-xhr-subscriber" - JavaScript hook |
| `data-subscribe-to` | Event type to listen for               |
| `data-xhr-url`      | URL for fetching updated content       |
| `data-xhr`          | ID for the updateable content area     |

## JavaScript

The component uses client-side JavaScript to:

1. Subscribe to specified event types
2. Periodically poll the `xhrUrl`
3. Replace inner content with response

## Notes

- Content can be provided via caller block, `html`, or `text`
- Initial content shows until first XHR response
- Used for real-time updates without full page refresh
- Common use cases: deployment progress, health checks, logs
