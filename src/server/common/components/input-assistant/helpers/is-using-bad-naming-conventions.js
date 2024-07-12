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
  return badNames.some((name) => value.includes(name))
}

export { isUsingBadNamingConventions }
