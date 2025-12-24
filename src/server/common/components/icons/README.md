# Icons

SVG icon components for use throughout the application.

## Usage

Each icon is imported from its own macro file:

```nunjucks
{% from "icons/tick-icon/macro.njk" import appTickIcon %}
{% from "icons/warning-icon/macro.njk" import appWarningIcon %}
{% from "icons/github-icon/macro.njk" import appGithubIcon %}

{{ appTickIcon({ description: "Success" }) }}
{{ appWarningIcon({ classes: "app-icon--small" }) }}
{{ appGithubIcon() }}
```

## Common Parameters

All icons share these common parameters:

| Name          | Type   | Required | Description                     |
| ------------- | ------ | -------- | ------------------------------- |
| `description` | string | No       | Accessible label (aria-label)   |
| `classes`     | string | No       | Additional CSS classes          |
| `attributes`  | object | No       | Additional HTML attributes      |
| `js`          | string | No       | JavaScript data attribute value |

## Available Icons

### Status Icons

| Icon            | Macro             | Description                |
| --------------- | ----------------- | -------------------------- |
| `tick-icon`     | `appTickIcon`     | Success/complete checkmark |
| `error-icon`    | `appErrorIcon`    | Error/failure cross        |
| `warning-icon`  | `appWarningIcon`  | Warning triangle           |
| `pending-icon`  | `appPendingIcon`  | Pending/loading indicator  |
| `complete-icon` | `appCompleteIcon` | Completion checkmark       |
| `alert-icon`    | `appAlertIcon`    | Alert notification         |
| `block-icon`    | `appBlockIcon`    | Blocked/denied indicator   |

### Instance Status Icons

| Icon                       | Macro                       | Description         |
| -------------------------- | --------------------------- | ------------------- |
| `instance-icon`            | `appInstanceIcon`           | Generic instance    |
| `instance-success-icon`    | `appInstanceSuccessIcon`    | Running instance    |
| `instance-pending-icon`    | `appInstancePendingIcon`    | Pending instance    |
| `instance-failed-icon`     | `appInstanceFailedIcon`     | Failed instance     |
| `instance-stopped-icon`    | `appInstanceStoppedIcon`    | Stopped instance    |
| `instance-undeployed-icon` | `appInstanceUndeployedIcon` | Undeployed instance |

### Platform Icons

| Icon            | Macro            | Description  |
| --------------- | ---------------- | ------------ |
| `github-icon`   | `appGithubIcon`  | GitHub logo  |
| `aws-icon`      | `appAwsIcon`     | AWS logo     |
| `mongo-db-icon` | `appMongoDbIcon` | MongoDB logo |
| `redis-icon`    | `appRedisIcon`   | Redis logo   |

### UI Icons

| Icon            | Macro             | Description                |
| --------------- | ----------------- | -------------------------- |
| `search-icon`   | `appSearchIcon`   | Search magnifying glass    |
| `cancel-icon`   | `appCancelIcon`   | Cancel/close cross         |
| `chevron-icon`  | `appChevronIcon`  | Directional chevron        |
| `copy-icon`     | `appCopyIcon`     | Copy to clipboard          |
| `user-icon`     | `appUserIcon`     | User profile               |
| `help-icon`     | `appHelpIcon`     | Help question mark         |
| `question-icon` | `appQuestionIcon` | Question mark              |
| `info-icon`     | `appInfoIcon`     | Information circle         |
| `star-icon`     | `appStarIcon`     | Star/favourite             |
| `terminal-icon` | `appTerminalIcon` | Terminal/console           |
| `curl-icon`     | `appCurlIcon`     | cURL command               |
| `database-icon` | `appDatabaseIcon` | Database                   |
| `schema-icon`   | `appSchemaIcon`   | Schema/structure           |
| `internal-icon` | `appInternalIcon` | Internal/private indicator |

## Size Classes

| Class                 | Size | Description |
| --------------------- | ---- | ----------- |
| (default)             | 40px | Default     |
| `app-icon--medium`    | 32px | Medium      |
| `app-icon--small`     | 24px | Small       |
| `app-icon--tiny`      | 20px | Tiny        |
| `app-icon--minute`    | 18px | Minute      |
| `app-icon--minuscule` | 16px | Minuscule   |

## Color Classes

| Class                 | Description     |
| --------------------- | --------------- |
| `app-icon--fill-blue` | Blue fill color |
| `app-icon--fill-red`  | Red fill color  |

## Examples

### Basic icon

```nunjucks
{{ appTickIcon() }}
```

### With description (accessible)

```nunjucks
{{ appTickIcon({ description: "Success" }) }}
```

### Small icon

```nunjucks
{{ appWarningIcon({ classes: "app-icon--small" }) }}
```

### Tiny icon

```nunjucks
{{ appGithubIcon({ classes: "app-icon--tiny" }) }}
```

### With data attribute

```nunjucks
{{ appTickIcon({ js: "validation-icon" }) }}
```

### Combined classes

```nunjucks
{{ appErrorIcon({
  classes: "app-icon--small app-error-icon--pulse",
  description: "Error occurred"
}) }}
```

## Accessibility

- All icons use `role="img"` for semantic meaning
- Use `description` parameter to provide `aria-label` for meaningful icons
- Decorative icons can omit description

## Notes

- Icons are inline SVGs for styling flexibility
- All icons use the `app-icon` base class plus a specific class (e.g., `app-tick-icon`)
- Icon colours are typically inherited or set via CSS
- Default viewBox is 48x48 for most icons

## Creating New Icons

Follow these steps to add a new icon to the component library.

### 1. Choose an Icon Source

We use [Material Symbols](https://fonts.google.com/icons) as our primary icon source. When selecting an icon, use these settings for consistency:

| Setting | Value |
| ------- | ----- |
| Fill    | Yes   |
| Weight  | 700   |
| Grade   | 200   |
| Size    | 48px  |

### 2. Download and Optimise

1. Download the SVG file from Material Symbols
2. Go to [SVGOMG](https://jakearchibald.github.io/svgomg/) to optimise the SVG
3. Upload the SVG file
4. Click the **Markup** tab
5. Copy the optimised markup

### 3. Create the Icon Component

1. Copy an existing icon folder from this directory (e.g., `tick-icon`)
2. Rename the folder to your new icon name (e.g., `my-new-icon`)
3. Update the files:

**macro.njk:**

```nunjucks
{% macro appMyNewIcon(params) %}
  {%- include "./template.njk" -%}
{% endmacro %}
```

**template.njk:**

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  class="app-icon app-my-new-icon{{ (' ' + params.classes) if params.classes else '' }}"
  viewBox="0 0 48 48"
  role="img"
  aria-label="{{ params.description if params.description else 'My new icon' }}"
>
  <!-- Paste optimised SVG path here -->
</svg>
```

**my-new-icon.scss:**

```scss
.app-my-new-icon {
  // Add any icon-specific styles here
}
```

### 4. Register the Icon Styles

Import the icon's SCSS file in `src/client/stylesheets/components/_icons.scss`:

```scss
@use 'icons/my-new-icon/my-new-icon';
```

### 5. Use the Icon

Import and use the icon in your templates:

```nunjucks
{% from "icons/my-new-icon/macro.njk" import appMyNewIcon %}

{{ appMyNewIcon({ description: "My new icon" }) }}
```

For icons used globally across many pages, consider importing them in the base layout at `src/server/common/templates/layouts/page.njk`.

### Live Style Guide

In development mode, admin users can view all available icons at `/style-guide/icons` with live examples, sizes, and usage documentation.
