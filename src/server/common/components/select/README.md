# Select

GOV.UK select dropdown with integrated loader support. If you don't need loader support for when your loading in the
data this select uses then just use a normal GOV.UK select component instead. This is a niche component hence it's not
been included in the Style Guide.

## Usage

```nunjucks
{{ appSelect({
  id: "environment",
  name: "environment",
  label: { text: "Environment" },
  items: [
    { value: "dev", text: "Development" },
    { value: "test", text: "Test" },
    { value: "prod", text: "Production" }
  ],
  loader: { name: "environment-loader" }
}) }}
```

## Parameters

| Name                              | Type    | Required | Description                   |
| --------------------------------- | ------- | -------- | ----------------------------- |
| `id`                              | string  | Yes      | Select element ID             |
| `name`                            | string  | Yes      | Select name attribute         |
| `label.text`                      | string  | Yes      | Label text                    |
| `label.html`                      | string  | No       | Label HTML content            |
| `label.classes`                   | string  | No       | Additional label classes      |
| `label.isPageHeading`             | boolean | No       | Render label as page heading  |
| `items`                           | array   | Yes      | Array of option items         |
| `value`                           | string  | No       | Pre-selected value            |
| `hint.text`                       | string  | No       | Hint text                     |
| `hint.html`                       | string  | No       | Hint HTML content             |
| `errorMessage.text`               | string  | No       | Error message text            |
| `errorMessage.html`               | string  | No       | Error message HTML            |
| `errorMessage.visuallyHiddenText` | string  | No       | Visually hidden prefix        |
| `disabled`                        | boolean | No       | Disable the select            |
| `classes`                         | string  | No       | Additional select classes     |
| `formGroup.classes`               | string  | No       | Additional form group classes |
| `describedBy`                     | string  | No       | IDs of describing elements    |
| `attributes`                      | object  | No       | Additional HTML attributes    |
| `loader.name`                     | string  | Yes      | Name for the loader component |

### Item object

| Name         | Type    | Required | Description                  |
| ------------ | ------- | -------- | ---------------------------- |
| `value`      | string  | Yes      | Option value                 |
| `text`       | string  | Yes      | Option display text          |
| `selected`   | boolean | No       | Whether option is selected   |
| `disabled`   | boolean | No       | Whether option is disabled   |
| `attributes` | object  | No       | Additional option attributes |

## Examples

### Basic select

```nunjucks
{{ appSelect({
  id: "colour",
  name: "colour",
  label: { text: "Favourite colour" },
  items: [
    { value: "", text: "Choose a colour" },
    { value: "red", text: "Red" },
    { value: "blue", text: "Blue" }
  ],
  loader: { name: "colour-loader" }
}) }}
```

### With pre-selected value

```nunjucks
{{ appSelect({
  id: "env",
  name: "environment",
  label: { text: "Environment" },
  value: "test",
  items: [
    { value: "dev", text: "Development" },
    { value: "test", text: "Test" },
    { value: "prod", text: "Production" }
  ],
  loader: { name: "env-loader" }
}) }}
```

### With hint

```nunjucks
{{ appSelect({
  id: "version",
  name: "version",
  label: { text: "Version" },
  hint: { text: "Select the version to deploy" },
  items: versionItems,
  loader: { name: "version-loader" }
}) }}
```

### With error

```nunjucks
{{ appSelect({
  id: "team",
  name: "team",
  label: { text: "Team" },
  errorMessage: { text: "Select a team" },
  items: teamItems,
  loader: { name: "team-loader" }
}) }}
```

## Notes

- This component extends GOV.UK select with an integrated loader
- If you don't need a loader, use the standard `govukSelect` component instead
- The loader shows when options are being fetched dynamically
