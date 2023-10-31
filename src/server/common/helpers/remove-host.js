function removeHost(url) {
  return url ? url?.split('/')?.slice(3)?.join('/') : null
}

export { removeHost }
