function teamUsers(team, hasTeamScope) {
  return team.users?.map((user) => {
    const formAction = `/teams/${team.teamId}/remove-member/${user.userId}`

    return {
      ...user,
      content: {
        text: user.name
      },
      action: {
        ...(hasTeamScope && {
          html: `<button class="govuk-button app-button app-button--small app-button--destructive" formaction="${formAction}">Remove</button>`
        })
      }
    }
  })
}

export { teamUsers }
