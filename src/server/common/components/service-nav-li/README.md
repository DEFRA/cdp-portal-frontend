# Service Nav Li

Navigation list item for GOV.UK service navigation. This is used in the CDP service nav and is not generally used
anywhere else. This is a niche component hence it's not been included in the Style Guide.

## Usage

```nunjucks
{{ appServiceNavLi({
  text: "Services",
  href: "/services",
  active: true
}) }}
```

## Parameters

| Name         | Type    | Required | Description                        |
| ------------ | ------- | -------- | ---------------------------------- |
| `text`       | string  | Yes\*    | Link text (\*use `text` or `html`) |
| `html`       | string  | Yes\*    | Link HTML content                  |
| `href`       | string  | No       | Link URL                           |
| `active`     | boolean | No       | Whether item is in active section  |
| `current`    | boolean | No       | Whether item is current page       |
| `attributes` | object  | No       | Additional HTML attributes         |

## Examples

### Basic navigation item

```nunjucks
{{ appServiceNavLi({
  text: "Services",
  href: "/services"
}) }}
```

### Active item

```nunjucks
{{ appServiceNavLi({
  text: "Deployments",
  href: "/deployments",
  active: true
}) }}
```

### Current page

```nunjucks
{{ appServiceNavLi({
  text: "Dashboard",
  href: "/dashboard",
  current: true
}) }}
```

### With HTML content

```nunjucks
{{ appServiceNavLi({
  html: "<span>Admin</span>",
  href: "/admin"
}) }}
```

### Text only (no link)

```nunjucks
{{ appServiceNavLi({
  text: "Disabled Section"
}) }}
```

## Display

Renders:

- `<li>` with GOV.UK service navigation classes
- `<a>` link if `href` provided, otherwise `<span>`
- Bold text when active or current
- `aria-current` attribute when active/current

## ARIA States

| State   | `aria-current` |
| ------- | -------------- |
| current | "page"         |
| active  | "true"         |

## Notes

- Adapted from GOV.UK Frontend service navigation component
- Used within the CDP Portal service navigation
- Active items show bold text via `govuk-service-navigation__active-fallback`
