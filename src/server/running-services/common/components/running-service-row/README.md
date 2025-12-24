# Running Service Row

Table row component for displaying running service information across environments.

## Usage

```nunjucks
{% from "running-services/common/components/running-service-row/macro.njk" import appEntityTableRunningServiceRow %}

{{ appEntityTableRunningServiceRow({
  loopIndex: 0,
  serviceName: "cdp-portal-frontend",
  isOwner: true,
  serviceTeams: [{ id: "platform", name: "Platform" }],
  allEnvironments: ["infra-dev", "dev", "test", "prod"],
  serviceEnvironments: serviceEnvironmentsData
}) }}
```

## Parameters

| Name                  | Type    | Required | Description                                    |
| --------------------- | ------- | -------- | ---------------------------------------------- |
| `rowClasses`          | string  | No       | Additional row CSS classes                     |
| `loopIndex`           | number  | Yes      | Table row index for data-testid                |
| `isOwner`             | boolean | No       | Shows star icon if user owns this service      |
| `serviceName`         | string  | Yes      | Service name (used for link and display)       |
| `serviceTeams`        | array   | No       | Array of team objects with `id` and `name`     |
| `allEnvironments`     | array   | Yes      | Array of environment names to show columns for |
| `serviceEnvironments` | object  | Yes      | Environment data keyed by environment name     |

### serviceTeams array item

| Name   | Type   | Description       |
| ------ | ------ | ----------------- |
| `id`   | string | Team identifier   |
| `name` | string | Team display name |

### serviceEnvironments object

Object with environment names as keys, each containing data for `appRunningServiceEntity`.

## Display

Shows a table row with:

- Owner indicator (star icon if owned)
- Service name (linked to `/running-services/{serviceName}`)
- Teams list (linked to team pages)
- Environment status columns using `appRunningServiceEntity`

## Notes

- Used within entity tables for the running services list
- Requires `appRunningServiceEntity` component for environment cells
- Empty environments show an empty placeholder
