# Footer

## Context Variables

The footer uses these variables from the global context:

| Name             | Type   | Description                      |
| ---------------- | ------ | -------------------------------- |
| `supportChannel` | string | URL to the Slack support channel |
| `serviceVersion` | string | Current application version      |

## Notes

- The footer is automatically included in the base page layout
- Version information is only shown when `serviceVersion` is available
- Links to external resources open in new windows with `rel="noopener noreferrer"`
