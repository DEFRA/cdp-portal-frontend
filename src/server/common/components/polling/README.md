# appPolling

Use inside of a `{% block xhrContent %}` block.

Wrap content to update inside of `<hx-partial id="...">`

## Example

```njk
  {% block xhrContent %}

    {{ appPolling({
      id: "example",
      enabled: true,
      url: "/my-updates",
      every: "6s"
    }) }}

    <hx-partial id="my-content">
      ...
    </hx-partial>

  {% endblock xhrContent %}
```
