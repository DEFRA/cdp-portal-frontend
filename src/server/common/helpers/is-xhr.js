function isXhr() {
  return this?.headers['x-requested-with'] === 'XMLHttpRequest'
}

export { isXhr }
