function transformUserToHeadingEntities(user) {
  return [
    {
      kind: 'date',
      value: user?.updatedAt,
      label: 'Updated'
    }
  ]
}

export { transformUserToHeadingEntities }
