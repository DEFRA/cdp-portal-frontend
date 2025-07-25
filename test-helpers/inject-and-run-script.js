export function injectAndRunScript(jsCode) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(jsCode)
  fn()
}
