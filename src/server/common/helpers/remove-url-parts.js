function removeUrlParts(url, parts = 3) {
  return url ? url?.split('/')?.slice(parts)?.join('/') : null
}

export { removeUrlParts }
