function transformTeamUsers(team) {
  return team.users.map((user) => {
    const userHref = '/admin/users/' + user.userId
    const formAction = `/admin/teams/${team.teamId}/remove-member/${user.userId}`

    return {
      ...user,
      content: {
        html: `<a class="app-link" href="${userHref}">${user.name}</a>`
      },
      action: {
        html: `<button class="govuk-button app-button app-button--small govuk-button--secondary" formaction="${formAction}">Remove</button>`
      }
    }
  })
}

export { transformTeamUsers }
