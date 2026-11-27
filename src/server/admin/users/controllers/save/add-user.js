import qs from 'qs'
import Joi from 'joi'

import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { searchAzureActiveDirectoryUsers } from '../../helpers/fetch/fetchers.js'

const addUserValidation = Joi.object({
  email: Joi.string().email().required(),
  github: Joi.string().allow('', null)
})

const addUserController = {
  handler: async (request, h) => {
    const payload = request.payload
    const { button, aadQuery, email, githubQuery, github } = payload

    const sanitisedPayload = {
      aadQuery,
      email,
      githubQuery,
      github
    }

    const queryString = qs.stringify(sanitisedPayload, {
      addQueryPrefix: true,
      skipNulls: true
    })

    // Search: redirect back to the form with existing selections preserved
    if (button === 'search') {
      return h.redirect(`/admin/users/add${queryString}`)
    }

    // Validate the selected user
    const validationResult = addUserValidation.validate(
      { email, github },
      { abortEarly: false }
    )

    if (validationResult.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(`/admin/users/add${queryString}`)
    }

    // Retrieve the full AAD user details
    const aadUsers = await searchAzureActiveDirectoryUsers(email)

    const aadUser = aadUsers?.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    )

    if (!aadUser) {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: {
          email: {
            message: 'Select a valid DEFRA user'
          }
        }
      })

      return h.redirect(`/admin/users/add${queryString}`)
    }

    // Add the completed user to the pending list
    const stepData = request.app.getStepData()
    const usersToCreate = stepData.usersToCreate ?? []

    const alreadyAdded = usersToCreate.some(
      (user) => user.userId === aadUser.userId
    )

    if (alreadyAdded) {
      return h.redirect('/admin/users/summary')
    }

    const newUser = {
      userId: aadUser.userId,
      name: aadUser.name,
      email: aadUser.email,
      github: github || null
    }

    await request.app.initStepData({
      ...stepData,
      usersToCreate: [...usersToCreate, newUser],
      aadQuery: null,
      email: null,
      githubQuery: null,
      github: null,
      userId: null,
      name: null
    })

    return h.redirect('/admin/users/summary')
  }
}

export { addUserController }
