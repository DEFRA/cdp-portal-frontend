# Entity Table

## Performance

> [!TIP]
> To see what is happening with template render performance in your application, have a read of
> [Event loop monitoring and load testing with Apache bench](/README.md#event-loop-monitoring-and-load-testing-with-apache-bench)

### Row Components (Recommended)

For large lists, use the **row component pattern** instead of the cells approach. This provides significant performance
improvements by:

1. **Avoiding `renderComponent` overhead** - The cells approach uses `appEntity` via `renderComponent` for each cell,
   which becomes slow with many rows
2. **Reducing template complexity** - Row components handle their own rendering logic, reducing the work done by the
   entity-table template
3. **Better maintainability** - Row components encapsulate domain-specific rendering logic

#### Migration from Cells to Rows

The cells approach is deprecated. Instead of:

```nunjucks
{# @deprecated - DO NOT USE for new code #}
{{ appEntityTable({
  headers: [...],
  rows: [
    {
      cells: [
        { headers: "name", entity: { kind: "link", value: "service", url: "/services/service" } },
        { headers: "status", entity: { kind: "tag", value: "Running", classes: "govuk-tag--green" } }
      ]
    }
  ]
}) }}
```

Use the caller pattern with row components:

```nunjucks
{% from "entity-table/macro.njk" import appEntityTable %}
{% from "services/common/components/service-row/macro.njk" import appEntityTableServiceRow %}

{% call(params) appEntityTable(tableData) %}
  {{ appEntityTableServiceRow({
    rowClasses: params.rowClasses,
    loopIndex: params.loopIndex,
    isOwner: params.row.isOwner,
    entityName: params.row.entityName,
    serviceTags: params.row.serviceTags,
    teams: params.row.teams,
    serviceType: params.row.serviceType,
    githubUrl: params.row.githubUrl,
    creationState: params.row.creationState
  }) | safe }}
{% endcall %}
```

#### Available Row Components

- `appEntityTableServiceRow` - For services list (`src/server/services/common/components/service-row`)
- `appEntityTableRunningServiceRow` - For running services list (
  `src/server/running-services/common/components/running-service-row`)

When creating new entity tables, create a domain-specific row component following these patterns.

#### Real-World Implementation Examples

These row component implementations have significantly improved performance for both the services and running-services
list pages.

##### Service Row

> [!TIP]
> A working example can be seen
> in [/src/server/services/common/components/service-row](/src/server/services/common/components/service-row)

Used in the services list page (`/services`), this row component renders service information including owner indicator,
service name with tags, teams, type, GitHub URL, and creation date.

```nunjucks
{# src/server/services/list/views/list.njk #}
{% from "services/common/components/service-row/macro.njk" import appEntityTableServiceRow %}

{% call(params) appEntityTable(tableData) %}
  {{ appEntityTableServiceRow({
    rowClasses: params.rowClasses,
    loopIndex: params.loopIndex,
    isOwner: params.row.isOwner,
    entityName: params.row.entityName,
    serviceTags: params.row.serviceTags,
    teams: params.row.teams,
    serviceType: params.row.serviceType,
    githubUrl: params.row.githubUrl,
    creationState: params.row.creationState
  }) | safe }}
{% endcall %}
```

##### Running Service Row

> [!TIP]
> A working example can be seen
> in [/src/server/running-services/common/components/running-service-row](/src/server/running-services/common/components/running-service-row)

Used in the running services list page (`/running-services`), this row component renders service status across multiple
environments dynamically.

```nunjucks
{# src/server/running-services/views/list.njk #}
{% from "running-services/common/components/running-service-row/macro.njk" import appEntityTableRunningServiceRow %}

{% call(params) appEntityTable(tableData) %}
  {{ appEntityTableRunningServiceRow({
    rowClasses: params.rowClasses,
    loopIndex: params.loopIndex,
    isOwner: params.row.isOwner,
    serviceName: params.row.serviceName,
    serviceTeams: params.row.serviceTeams,
    serviceEnvironments: params.row.serviceEnvironments,
    allEnvironments: environments
  }) | safe }}
{% endcall %}
```

Both implementations avoid the `renderComponent`/`appEntity` overhead by directly rendering HTML in the row template,
resulting in much faster page loads for lists with many rows.

### Known Performance Issues

#### renderComponent and entity

The `renderComponent` helper and `appEntity` component can be slow when rendering large amounts of data. This is
because:

1. Each `renderComponent` call involves Nunjucks template compilation and rendering
2. The `appEntity` component has many conditional branches for different entity kinds
3. Nested entities (lists, groups) multiply this overhead

For tables with 50+ rows, the cells approach can add noticeable latency. The row component pattern avoids this by
rendering HTML directly in the row template. This avoids looping through all the cells in a row and calling
`renderComponent` for each cell, which in turn then calls `appEntity` with multiple choices in an if-else structure.
Rather than using the cell approach, we can provide a row component that knows how to render the row directly, avoiding
the overhead of multiple cells and `renderComponent` calls, when we know what the structure of the data will be.

If you are refactoring slow tables and switching to the row component pattern for better performance. Its worth having
a look over
the [Event loop monitoring and load testing with Apache bench](/README.md#event-loop-monitoring-and-load-testing-with-apache-bench)
section in the main README to help identify performance bottlenecks. With this you can compare before and after
performance
when refactoring tables to use row components and find exactly what is causing slowness in your templates.
