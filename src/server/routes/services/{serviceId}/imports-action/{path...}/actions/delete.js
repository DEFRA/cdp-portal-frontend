import { getRawPath } from '#server/common/helpers/url/url-helpers.js'
import {
  deleteResource,
  listPathContents
} from '#server/common/services/bucket-service/BucketService.js'
import Joi from 'joi'

export default {
  title() {
    return 'Delete resource'
  },

  description(request) {
    const { path } = request.params
    const isFolder = getRawPath(request).endsWith('/')

    if (isFolder) {
      return `Delete folder <strong>${path}/</strong>`
    }

    return `Delete file <strong>${path}</strong>`
  },

  async schema(request) {
    const { path = '' } = request.params
    const isFolder = getRawPath(request).endsWith('/')
    const entity = request.app.entity

    const name = path.split('/').at(-1)

    let nonEmptyFolder = false
    if (isFolder) {
      const resources = await listPathContents(
        request,
        `/entities/${entity.name}/imports/`,
        path
      )

      nonEmptyFolder = resources.length !== 0

      return Joi.object({
        name: Joi.string()
          .label(`Confirm folder name - ${name}`)
          .description('Enter the name of the folder to delete')
          .valid(name)
          .messages({
            'any.invalid': 'Please enter the exact file name',
            'any.only': 'Please confirm the folder name'
          })
          .min(1)
          .max(500)
          .required()
      })
    }

    return Joi.object({
      name: Joi.string()
        .label(`Confirm file name - ${name}`)
        .description('Enter the name of the file to delete')
        .valid(name)
        .messages({
          'any.invalid': 'Please enter the exact file name',
          'any.only': 'Please confirm the file name'
        })
        .min(1)
        .max(500)
        .required()
    })
  },

  async actions(request) {
    const { path = '' } = request.params
    const entity = request.app.entity
    const parentPath = path.split('/').slice(0, -1).join('/')

    return {
      submit: {
        text: 'Delete',
        async method(request, h) {
          const { path = '' } = request.params
          const isFolder = getRawPath(request).endsWith('/')

          await deleteResource(
            request,
            `/entities/${entity.name}/imports/`,
            `${path}${isFolder ? '/' : ''}`
          )

          return h.redirect(`/services/${entity.name}/imports/${parentPath}`)
        }
      },
      cancel: {
        text: 'Cancel',
        url: `/services/${entity.name}/imports/${parentPath}`
      }
    }
  }
}
