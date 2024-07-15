// TODO move these into a Client env via webpack and DefinePlugin
const badNames = [
  'new',
  'next',
  'discovery',
  'alpha',
  'beta',
  'repository',
  'repo',
  'main',
  'master',
  'react'
]

function isUsingBadNamingConventions(value) {
  return badNames.some((name) => value.includes(name) || value.match(/v\d/i))
}

export { isUsingBadNamingConventions }
