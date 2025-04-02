import { runnerProfiles } from '~/src/server/test-suites/constants/runner-profiles.js'
import { findEnvironmentsForTestSuite } from '~/src/server/test-suites/helpers/find-environments-for-test-suite.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { environments } from '~/src/config/environments.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'

const profileHtmlTemplate = ({
  cpu,
  memory
}) => `<div><span>CPU:</span><span class="govuk-!-margin-left-1">${cpu.text}</span></div>
   <div><span>Memory:</span><span class="govuk-!-margin-left-1">${memory.text}</span></div>`

const buildEnvironmentOptions = async (request, isAdmin = false) => {
  const options = []
  const runnableEnvironments = findEnvironmentsForTestSuite(
    request.pre.testSuite
  )
  const userOwnsTestSuite = await request.userIsMemberOfATeam(
    request.pre.testSuite.teams.map((team) => team.teamId)
  )

  if (isAdmin) {
    options.push(
      environments.infraDev.kebabName,
      environments.management.kebabName
    )
  }

  if (userOwnsTestSuite || isAdmin) {
    options.push(...runnableEnvironments)
  }

  return options.length > 0
    ? buildOptions(options.toSorted(sortByEnv))
    : options
}

const provideFormValues = {
  method: async (request) => {
    const environmentOptions = []
    const runnerProfileOptions = []

    const authedUser = await request.getUserSession()

    if (authedUser?.isAuthenticated) {
      const isAdmin = authedUser?.isAdmin
      const userOwnsTestSuite = await request.userIsMemberOfATeam(
        request.pre.testSuite.teams.map((team) => team.teamId)
      )

      const options = await buildEnvironmentOptions(request, isAdmin)
      environmentOptions.push(...options)

      if (isAdmin || userOwnsTestSuite) {
        runnerProfileOptions.push(
          {
            value: 'regular',
            text: 'Regular',
            label: { classes: 'govuk-!-font-weight-bold' },
            checked: true,
            hint: {
              html: profileHtmlTemplate(runnerProfiles.regular)
            }
          },
          {
            value: 'large',
            text: 'Large',
            label: { classes: 'govuk-!-font-weight-bold' },
            hint: {
              html: profileHtmlTemplate(runnerProfiles.large)
            }
          }
        )
      }
    }

    return { environmentOptions, runnerProfileOptions }
  },
  assign: 'formValues'
}

export { provideFormValues }
