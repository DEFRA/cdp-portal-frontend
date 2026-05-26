import { populatePathParams } from '#server/plugins/multistep-form/populate-path-params.js'

export const urlTemplates = {
  stepOne: '/admin/teams/team-details/{multiStepFormId?}',
  stepTwo: '/admin/teams/find-github-team/{multiStepFormId}',
  stepThree: '/admin/teams/summary/{multiStepFormId}'
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
      text: 'Details'
    },
    {
      url: stepTwoUrl,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(stepTwoUrl),
      text: 'GitHub team'
    },
    {
      url: stepThreeUrl,
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(stepThreeUrl),
      text: 'Summary'
    }
  ]
}
