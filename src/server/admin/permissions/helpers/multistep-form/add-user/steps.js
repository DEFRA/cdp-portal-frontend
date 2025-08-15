const urls = {
  stepOne: '/admin/permissions/{scopeId}/user/add',
  stepTwo: '/admin/permissions/{scopeId}/user/{userId}/team/add',
  stepThree: '/admin/permissions/{scopeId}/user/{userId}/team/{teamId}/summary'
}

function createPathMatcher(url) {
  const regexStr = '^' + url.replace(/\{[^}]+}/g, '[^/]+') + '$'
  return new RegExp(regexStr)
}

function pathMatchesUrl(path, url) {
  const matcher = createPathMatcher(url)
  return matcher.test(path)
}

function formSteps(path, multiStepFormId, stepData, isMultistepComplete) {
  const isComplete = isMultistepComplete(stepData)
  const withId = (url) => `${url}/${multiStepFormId}`

  return [
    {
      url: withId(urls.stepOne),
      isComplete: isComplete.stepOne,
      isCurrent: pathMatchesUrl(path, urls.stepOne),
      text: 'User'
    },
    {
      url: withId(urls.stepTwo),
      isComplete: isComplete.stepTwo,
      isCurrent: pathMatchesUrl(path, withId(urls.stepTwo)),
      text: 'Team'
    },
    {
      isComplete: isComplete.stepThree,
      isCurrent: pathMatchesUrl(path, withId(urls.stepThree)),
      text: 'Summary'
    }
  ]
}

export { formSteps, urls }
