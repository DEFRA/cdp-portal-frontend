import Joi from 'joi'

import { provideStepData } from '../../common/helpers/multistep-form/provide-step-data.js'
import { checkSessionIsValid } from '../../common/helpers/multistep-form/check-session-is-valid.js'
import { changelogApplyRows } from '../transformers/changelog-apply-rows.js'

const summaryController = {
  options: {
    ext: {
      onPreHandler: checkSessionIsValid('/apply-changelog')
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

    return h.view('apply-changelog/views/summary', {
      pageTitle: 'Apply changelog summary',
      dbApplyChangelogRows: changelogApplyRows(stepData, multiStepFormId),
      stepData,
      multiStepFormId
    })
  }
}

export { summaryController }
