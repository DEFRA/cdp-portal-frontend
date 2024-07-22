import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'

import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions'
import { relativeDate } from '~/src/server/common/helpers/date/relative-date'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { detailsValidation } from '~/src/server/deploy-service/helpers/schema/details-validation'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

async function getAdditionalData(imageName) {
  if (!imageName) {
    return {
      availableVersionOptions: optionsWithMessage('choose an image name')
    }
  }

  const availableVersions = await fetchAvailableVersions(imageName)
  const availableVersionOptions = buildSuggestions(
    availableVersions.map((version) => ({
      text: version.tag,
      value: version.tag,
      hint: relativeDate(version.created)
    }))
  )
  const service = await fetchDeployableService(imageName)
  const environments = getEnvironmentsByTeam(service?.teams)
  const runningServices = (await fetchRunningServicesById(imageName)) ?? []
  const runningServicesEntityRows = compose(
    runningServicesToEntityRow(environments),
    withEnvironments
  )(runningServices)
  const rowHeadings = buildRunningServicesRowHeadings(environments)

  return {
    runningServicesEntityRows,
    rowHeadings,
    availableVersionOptions,
    latestVersions: availableVersions.slice(0, 4)
  }
}

const detailsFormController = {
  options: {
    id: 'deploy-service/details',
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment],
    validate: {
      query: detailsValidation,
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const deployment = request.pre?.deployment
    const imageName = query?.imageName ?? deployment?.imageName

    const deployableImageNames = await fetchDeployableImageNames({ request })
    const deployableImageNameOptions = buildOptions(deployableImageNames ?? [])
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.isAdmin)
    const environmentOptions = environments
      ? buildOptions(Object.values(environments))
      : []

    const {
      runningServicesEntityRows,
      rowHeadings,
      availableVersionOptions,
      latestVersions
    } = await getAdditionalData(imageName)

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy Service details',
      heading: 'Details',
      headingCaption:
        'Provide the microservice image name, version and environment to deploy to.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      environmentOptions,
      deployableImageNameOptions,
      availableVersionOptions,
      imageName,
      latestVersions,
      runningServicesEntityRows,
      rowHeadings
    })
  }
}

export { detailsFormController }
