export function isXhr() {
  return (
    this?.headers['x-requested-with'] === 'XMLHttpRequest' ||
    this?.headers['hx-request-type'] === 'partial'
  )
}
