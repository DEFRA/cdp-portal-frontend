import {
  createEmptyFolder,
  listPathContents
} from '#server/common/services/bucket-service/BucketService.js'
import Joi from 'joi'

export default {
  async schema(request) {
    const { path = '' } = request.params
    const entity = request.app.entity

    const resources = await listPathContents(
      request,
      `/entities/${entity.name}/imports/`,
      path
    )

    const folders = resources.filter(({ isFolder }) => isFolder === true)

    return Joi.object({
      name: Joi.string()
        .label('Folder name')
        .description('Name of the new folder')
        .invalid(...folders.map(({ name }) => name))
        .messages({
          'any.invalid': 'Name already exists',
          'string.pattern.base': 'Please enter a valid folder name'
        })
        .min(1)
        .max(100)
        .regex(/^[a-zA-Z0-9-_]+$/)
        .required()
    })
  },

  async actions(request) {
    const { path = '' } = request.params
    const entity = request.app.entity

    return {
      submit: {
        text: 'Create',
        async method(request, h, sanitisedFormValues) {
          const { name } = sanitisedFormValues

          await createEmptyFolder(
            request,
            `/entities/${entity.name}/imports/`,
            `${path}/${name}`
          )

          return h.redirect(`/services/${entity.name}/imports/${path}`)
        }
      },
      cancel: {
        text: 'Cancel',
        url: `/services/${entity.name}/imports/${path}`
      }
    }
  }
}
