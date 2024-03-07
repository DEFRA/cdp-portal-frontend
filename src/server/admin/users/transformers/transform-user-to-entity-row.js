function transformUserToEntityRow(user) {
  return [
    {
      kind: 'link',
      value: user.name ? user.name : null,
      url: `/admin/users/${user.userId}`
    },
    {
      kind: 'link',
      value: user.email,
      url: `mailto:${user.email}`
    },
    {
      kind: 'link',
      value: user.github ? `@${user.github}` : null,
      url: `https://github.com/orgs/DEFRA/people/${user.github}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: user.defraAwsId
    },
    {
      kind: 'text',
      value: user.defraVpnId
    }
  ]
}

export { transformUserToEntityRow }
