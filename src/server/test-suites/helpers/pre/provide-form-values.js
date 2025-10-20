import { runnerConfigurations } from '../../constants/runner-configurations.js'
import { findEnvironmentsForTestSuite } from '../find-environments-for-test-suite.js'
import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { environments } from '../../../../config/environments.js'
import { sortByEnv } from '../../../common/helpers/sort/sort-by-env.js'

const profileHtmlTemplate = ({
  cpu,
  memory
}) => `<div><span>CPU:</span><span class="govuk-!-margin-left-1">${cpu.text}</span></div>
   <div><span>Memory:</span><span class="govuk-!-margin-left-1">${memory.text}</span></div>`

// TODO potentially abstract?
const buildEnvironmentOptions = (entity, isAdmin, userOwnsTestSuite) => {
  const options = []
  const runnableEnvironments = findEnvironmentsForTestSuite(entity)

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
    const runnerConfigOptions = []
    const userSession = await request.getUserSession()

    if (userSession?.isAuthenticated) {
      const isAdmin = await request.userIsAdmin()
      const entity = request.app.entity
      const userOwnsTestSuite = await request.userIsOwner(entity)

      const options = buildEnvironmentOptions(
        entity,
        isAdmin,
        userOwnsTestSuite
      )
      environmentOptions.push(...options)

      if (isAdmin || userOwnsTestSuite) {
        runnerConfigOptions.push(
          {
            value: 'regular',
            text: 'Regular',
            label: { classes: 'govuk-!-font-weight-bold' },
            checked: true,
            hint: {
              html: profileHtmlTemplate(runnerConfigurations.regular)
            }
          },
          {
            value: 'large',
            text: 'Large',
            label: { classes: 'govuk-!-font-weight-bold' },
            hint: {
              html: profileHtmlTemplate(runnerConfigurations.large)
            }
          }
        )
      }
    }

    return { environmentOptions, runnerConfigOptions }
  },
  assign: 'formValues'
}

export { provideFormValues }
