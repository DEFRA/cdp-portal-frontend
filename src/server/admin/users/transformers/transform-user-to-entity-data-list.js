function transformUserToEntityDataList(user) {
  return [
    {
      heading: {
        text: 'Name'
      },
      entity: {
        kind: 'text',
        value: user.name
      }
    },
    {
      heading: {
        text: 'Email'
      },
      entity: {
        kind: 'link',
        value: user.email,
        url: `mailto:${user.email}`
      }
    },
    {
      heading: {
        text: 'GitHub'
      },
      entity: {
        kind: 'link',
        value: user.github ? `@${user.github}` : null,
        url: `https://github.com/${user.github}`,
        newWindow: true
      }
    },
    {
      heading: {
        text: 'Defra Aws Id'
      },
      entity: {
        kind: 'text',
        value: user.defraAwsId
      }
    },
    {
      heading: {
        text: 'Defra Vpn Id'
      },
      entity: {
        kind: 'text',
        value: user.defraVpnId
      }
    },
    {
      heading: {
        text: 'Created'
      },
      entity: {
        kind: 'date',
        value: user.createdAt
      }
    }
  ]
}

export { transformUserToEntityDataList }
