# Input Assistant

## Behaviour

The input assistant monitors an input field and shows warnings when:

- The value contains uppercase letters
- The value uses underscores instead of hyphens
- The value doesn't follow naming conventions

## JavaScript

The component requires client-side JavaScript to function. It:

1. Monitors the target input for changes
2. Evaluates the value against naming conventions
3. Shows/hides the warning message accordingly

## Notes

- Displays a warning icon when active
- The message is shown when the input value doesn't meet conventions
- Used in create forms to encourage consistent naming
