import Joi from 'joi'

import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { checkSessionIsValid } from '~/src/server/common/helpers/multistep-form/check-session-is-valid.js'
import { updateRows } from '~/src/server/update-database/transformers/update-rows.js'

const summaryController = {
  options: {
    ext: {
      onPreHandler: checkSessionIsValid('/update-database')
    },
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().required()
      })
    }
  },
  handler: (request, h) => {
    const stepData = request.pre?.stepData
    const multiStepFormId = request.params?.multiStepFormId

    return h.view('update-database/views/summary', {
      pageTitle: 'Update Database summary',
      dbUpdateRows: updateRows(stepData, multiStepFormId),
      stepData,
      multiStepFormId
    })
  }
}

export { summaryController }
