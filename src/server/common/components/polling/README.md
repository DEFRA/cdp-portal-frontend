# appPolling

Use inside of a `{% block xhrContent %}` block.

Wrap content to update inside of `<hx-partial id="...">`

## Example

```njk
  {% block xhrContent %}

    {% call appPolling({
      id: "example",
      enabled: true,
      url: "/my-updates",
      every: "6s"
    }) %}

      ... content to update ...

    {% endcall %}

    ...

    <hx-partial id="my-content">
      ... out of band content to update ...
    </hx-partial>

    ...

  {% endblock xhrContent %}
```
