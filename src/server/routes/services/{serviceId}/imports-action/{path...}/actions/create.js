import Joi from 'joi'

export default {
  async schema(request) {
    const { path = '' } = request.params

    return Joi.object({
      name: Joi.string()
        .label('Folder name')
        .description(
          `Name of the new folder to add under <strong>${path}</strong>`
        )
        .min(1)
        .max(100)
        .regex(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)
        .required()
    })
  },

  async actions(request, h) {
    return {}
  }
}
