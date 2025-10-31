import { runnerConfigurations } from '../../constants/runner-configurations.js'
import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { sortByEnv } from '../../../common/helpers/sort/sort-by-env.js'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'

const profileHtmlTemplate = ({
  cpu,
  memory
}) => `<div><span>CPU:</span><span class="govuk-!-margin-left-1">${cpu.text}</span></div>
   <div><span>Memory:</span><span class="govuk-!-margin-left-1">${memory.text}</span></div>`

const provideFormValues = {
  method: async (request) => {
    const environmentOptions = []
    const runnerConfigOptions = []
    const userSession = await request.getUserSession()

    if (userSession?.isAuthenticated) {
      const isAdmin = await request.userIsAdmin()
      const entity = request.app.entity
      const userOwnsTestSuite = await request.userIsOwner(entity)

      const environments = getEnvironments(
        userSession.scope,
        entity.subType
      ).toSorted(sortByEnv)

      if (isAdmin || userOwnsTestSuite) {
        const options =
          environments.length > 0 ? buildOptions(environments) : []
        environmentOptions.push(...options)

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
