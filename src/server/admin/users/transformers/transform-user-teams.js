function transformUserTeams(user) {
  return user.teams.map((team) => {
    const teamHref = '/admin/teams/' + team.teamId

    return {
      ...team,
      content: {
        html: `<a class="app-link" href="${teamHref}">${team.name}</a>`
      }
    }
  })
}

export { transformUserTeams }
