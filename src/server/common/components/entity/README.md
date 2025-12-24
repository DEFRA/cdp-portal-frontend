# Entity

## Performance Considerations

The `appEntity` component is a flexible, multi-purpose renderer that handles many different entity kinds. This flexibility comes with a performance cost when rendering large amounts of data.

### Known Performance Issues

1. **Template complexity** - The component has many conditional branches for different entity kinds, which adds overhead for each render
2. **Nested entities** - Entity kinds like `list` and `group` recursively render child entities, multiplying overhead
3. **renderComponent overhead** - When used via `renderComponent` (e.g., in entity-table cells), each call involves template compilation

### When to Avoid

For large tables (50+ rows), avoid using `appEntity` via the entity-table cells approach. Instead, use domain-specific row components that render HTML directly. See the [entity-table README](../entity-table/README.md) for the recommended row component pattern.

### When to Use

`appEntity` is appropriate for:

- Single entity displays (e.g., in summary lists)
- Small tables with few rows
- Prototyping before optimizing
- Cases where flexibility is more important than raw performance
