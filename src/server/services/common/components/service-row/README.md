# Service Row

Table row component for displaying service information in the services list.

## Usage

```nunjucks
{% from "services/common/components/service-row/macro.njk" import appEntityTableServiceRow %}

{{ appEntityTableServiceRow({
  loopIndex: 0,
  entityName: "cdp-portal-frontend",
  isOwner: true,
  teams: [{ url: "/teams/platform", value: "Platform" }],
  serviceType: "Frontend",
  githubUrl: "https://github.com/DEFRA/cdp-portal-frontend",
  creationState: { date: "2024-01-15T10:30:00Z" }
}) }}
```

## Parameters

| Name            | Type    | Required | Description                               |
| --------------- | ------- | -------- | ----------------------------------------- |
| `rowClasses`    | string  | No       | Additional row CSS classes                |
| `loopIndex`     | number  | Yes      | Table row index for data-testid           |
| `isOwner`       | boolean | No       | Shows star icon if user owns this service |
| `entityName`    | string  | Yes      | Service name                              |
| `serviceTags`   | array   | No       | Array of tag objects                      |
| `teams`         | array   | No       | Array of team objects                     |
| `serviceType`   | string  | Yes      | Service type (Frontend, Backend, etc.)    |
| `githubUrl`     | string  | Yes      | GitHub repository URL                     |
| `creationState` | object  | Yes      | Creation date or status tag               |

### serviceTags array item

| Name          | Type   | Description      |
| ------------- | ------ | ---------------- |
| `displayName` | string | Tag display text |
| `className`   | string | Tag CSS class    |

### teams array item

| Name    | Type   | Description       |
| ------- | ------ | ----------------- |
| `url`   | string | Team page URL     |
| `value` | string | Team display name |

### creationState object

Either contains a date or a status:

| Name      | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| `date`    | string | ISO date string (if created)            |
| `value`   | string | Status text (if not yet created)        |
| `classes` | string | Status tag classes (if not yet created) |

## Display

Shows a table row with:

- Owner indicator (star icon if owned)
- Service name with optional tags
- Teams list (linked to team pages)
- Service type tag
- GitHub URL (external link)
- Creation date or status
