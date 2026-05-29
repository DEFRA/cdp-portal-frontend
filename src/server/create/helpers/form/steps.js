import { populatePathParams } from '#server/plugins/multistep-form/populate-path-params.js'

export const urlTemplates = {
  stepOne: '/create/choose-kind',
  stepTwo: '/create/{kind}/detail',
  stepThree: '/create/{kind}/summary'
}

export function formSteps({
  path,
  params,
  stepData = null,
  isMultistepComplete = () => ({})
}) {
  const isComplete = isMultistepComplete(stepData)

  const stepOneUrl = populatePathParams(params, urlTemplates.stepOne)
  const stepTwoUrl = populatePathParams(params, urlTemplates.stepTwo)
  const stepThreeUrl = populatePathParams(params, urlTemplates.stepThree)

  return [
    {
      url: stepOneUrl,
      isComplete: isComplete.stepOne,
      isCurrent: path.includes(stepOneUrl),
      text: 'Create'
    },
    {
      url: stepTwoUrl,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(stepTwoUrl),
      text: 'Details'
    },
    {
      url: stepThreeUrl,
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(stepThreeUrl),
      text: 'Summary'
    }
  ]
}
