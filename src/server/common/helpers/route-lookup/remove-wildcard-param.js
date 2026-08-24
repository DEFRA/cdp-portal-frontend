/**
 * If a route has a wildcard parameter, and the parameter is not provided, remove it from the path
 * Note: It is important to be aware that only the last named parameter in a path can be wildcard
 * @param {string} path
 * @param {Record<string, string>} params
 * @returns {string}
 */
export default function removeOptionalParam(path, params) {
  const match = path.match(/{(\w+)\*}/)
  const optionalParamName = match?.at(1)

  if (optionalParamName && !Object.keys(params).includes(optionalParamName)) {
    return path.replace(new RegExp(`/{${optionalParamName}\\*}`, 'gi'), '')
  }

  if (optionalParamName && Object.keys(params).includes(optionalParamName)) {
    return path.replace(
      new RegExp(`{${optionalParamName}\\*}`, 'gi'),
      params[optionalParamName]
    )
  }

  return path
}
