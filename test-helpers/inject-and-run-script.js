export function injectAndRunScript(jsCode) {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
  const fn = new Function(jsCode)
  fn()
}
