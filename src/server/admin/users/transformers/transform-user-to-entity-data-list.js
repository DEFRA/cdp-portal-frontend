function transformUserToEntityDataList(user) {
  return [
    {
      heading: 'Name',
      entity: {
        kind: 'text',
        value: user.name
      }
    },
    {
      heading: 'Email',
      entity: {
        kind: 'link',
        value: user.email,
        url: `mailto:${user.email}`
      }
    },
    {
      heading: 'Github',
      entity: {
        kind: 'link',
        value: user.github ? `@${user.github}` : null,
        url: `https://github.com/${user.github}`,
        newWindow: true
      }
    },
    {
      heading: 'Defra Aws Id',
      entity: {
        kind: 'text',
        value: user.defraAwsId
      }
    },
    {
      heading: 'Defra Vpn Id',
      entity: {
        kind: 'text',
        value: user.defraVpnId
      }
    },
    {
      heading: 'Created',
      entity: {
        kind: 'date',
        value: user.createdAt
      }
    }
  ]
}

export { transformUserToEntityDataList }
