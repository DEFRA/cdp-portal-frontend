function transformUserToHeadingEntities(user) {
  return [
    {
      kind: 'date',
      value: user?.updatedAt,
      label: 'Last updated'
    }
  ]
}

export { transformUserToHeadingEntities }
