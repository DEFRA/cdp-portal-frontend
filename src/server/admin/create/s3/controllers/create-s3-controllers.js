import Joi from 'joi'
import {
  repositoryNameValidation,
  environments
} from '@defra/cdp-validation-kit'

import { triggerCdpCreateWorkflow } from '#server/admin/create/helpers/fetchers.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { fetchServices } from '#server/common/helpers/fetch/fetch-entities.js'
import { sortByName } from '#server/common/helpers/sort/sort-by-name.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

const createBucketEnvironments = {
  ...environments,
  tenant: 'tenant',
  platform: 'platform',
  all: 'all',
  ...environments
}

const createBucketValidation = Joi.object({
  service: repositoryNameValidation,
  bucketName: Joi.string()
    .min(3)
    .max(63)
    .regex(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)
    .required(),
  environment: Joi.string()
    .valid(...Object.values(createBucketEnvironments))
    .required()
})

export const createS3BucketFormController = {
  options: {
    id: 'admin/create/s3'
  },
  handler: async (request, h) => {
    const validationFailures = request.yar.flash(sessionNames.validationFailure)
    const formValues = validationFailures?.at(0)?.formValues ?? {}
    const formErrors = validationFailures?.at(0)?.formErrors ?? {}

    const entities = await fetchServices()
    const entityNames =
      entities
        .map((e) => e.name)
        .toSorted(sortByName)
        .map((entityName) => ({ value: entityName, text: entityName })) ?? []
    const entityOptions = buildOptions(entityNames)

    return h.view('admin/create/s3/views/create-s3', {
      pageTitle: 'Create S3 Bucket',
      formValues,
      formErrors,
      entityOptions,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Create',
          href: '/admin/create'
        },
        {
          text: 'S3'
        }
      ]
    })
  }
}

export const createS3BucketPostController = {
  options: {
    id: 'admin/create/s3post'
  },
  handler: async (request, h) => {
    const validationResult = createBucketValidation.validate(request.payload, {
      stripUnknown: true,
      abortEarly: false
    })

    if (validationResult?.error) {
      request.logger.error('Validation error', validationResult?.error)
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: request.payload,
        formErrors: errorDetails
      })

      return h.redirect(`/admin/create/s3`)
    }

    const payload = request.payload
    const branchName = `create-s3-${payload.bucketName}-${payload.service}`

    const createS3Params = {
      service: payload.service,
      bucketName: payload.bucketName,
      environment: payload.environment,
      useBranch: branchName,
      runId: `create-s3-bucket-${payload.bucketName}-for-${payload.service}`,
      prTitle: `Add S3 bucket ${payload.bucketName} to ${payload.service} in ${payload.environment}`
    }

    try {
      await triggerCdpCreateWorkflow(request, 's3', createS3Params)
    } catch (error) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'Failed to request resource: ' + error
      )

      return h.redirect(`/admin/create/s3`)
    }

    const branchLink = `https://github.com/DEFRA/cdp-portal-backend/tree/${encodeURIComponent(branchName)}`
    const prLink = 'https://github.com/DEFRA/cdp-tenant-config/pulls'

    return h.view('admin/create/s3/views/create-s3-done', {
      pageTitle: 'S3 Bucket Requested',
      formValues: request.payload,
      branchName,
      branchLink,
      prLink,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Create',
          href: '/admin/create'
        },
        {
          text: 'S3'
        }
      ]
    })
  }
}
