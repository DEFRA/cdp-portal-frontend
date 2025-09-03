import Joi from 'joi'

import { changelogApplyRows } from '../transformers/changelog-apply-rows.js'
import { provideStepData } from '../../common/helpers/multistep-form/provide-step-data.js'

const summaryController = {
  options: {
    id: 'apply-changelog/summary/{multiStepFormId}',
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

    return h.view('apply-changelog/views/summary', {
      pageTitle: 'Apply changelog summary',
      dbApplyChangelogRows: changelogApplyRows(stepData, multiStepFormId),
      stepData,
      multiStepFormId
    })
  }
}

export { summaryController }
