// TODO remove this - we should expose full urls where we can
function removeUrlParts(url, parts = 3) {
  return url ? url?.split('/')?.slice(parts)?.join('/') : null
}

export { removeUrlParts }
