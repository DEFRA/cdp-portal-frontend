# Resources Intro

Introduction section for service resources page with documentation links.

## Usage

```nunjucks
{% from "services/common/components/resources-intro/macro.njk" import appResourcesIntro %}

{{ appResourcesIntro({
  caption: "cdp-portal-frontend",
  heading: "Resources",
  entity: { name: "cdp-portal-frontend" },
  hasBuckets: true
}) }}
```

## Parameters

| Name          | Type    | Required | Description                      |
| ------------- | ------- | -------- | -------------------------------- |
| `caption`     | string  | Yes      | Caption text above heading       |
| `heading`     | string  | Yes      | Page heading text                |
| `entity.name` | string  | Yes      | Entity name for description text |
| `hasBuckets`  | boolean | No       | Show bucket naming info panel    |

## Display

Shows:

- Caption (service name)
- Heading
- Description with documentation links to:
  - S3 buckets documentation
  - SQS Queues and SNS Topics documentation
  - CDP support Slack channel
- Info panel about bucket naming (if `hasBuckets` is true)

## Notes

- Uses global `supportChannel` context variable for Slack link
- Documentation links open in new window
- Info panel explains random characters in bucket names
