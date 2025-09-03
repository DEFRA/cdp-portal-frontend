import qs from 'qs'

function buildRow(name, value, url, query = {}) {
  const queryString = qs.stringify(
    { ...query, redirectLocation: 'summary' },
    { addQueryPrefix: true }
  )

  const withTestIdWrapper = (text) => {
    if (text) {
      return `<span data-testid="${name.toLowerCase().replace(/\s+/g, '-')}">${text}</span>`
    }

    return null
  }

  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: {
      html: withTestIdWrapper(value)
    },
    ...(url && {
      actions: {
        classes: 'app-summary__action',
        items: [
          {
            href: url + queryString,
            text: 'Change',
            classes: 'app-link',
            visuallyHiddenText: name
          }
        ]
      }
    })
  }
}

function userPermissionToSummary({ user, scope, stepData, stepUrls }) {
  return [
    buildRow('Permission', scope.value),
    buildRow('For user', user.name, stepUrls.stepOne, {
      searchQuery: stepData.searchQuery
    }),
    buildRow(
      'In team',
      user.teams.find(({ teamId }) => teamId === stepData.teamId).name,
      stepUrls.stepTwo
    )
  ]
}

export { userPermissionToSummary }
