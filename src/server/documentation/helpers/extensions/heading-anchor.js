export function headingToAnchor(text) {
  return text
    .toLowerCase()
    .replace(/\W+/g, '-') // 'foo: bar' → 'foo-bar'   // not 'foo--bar'
    .replace(/^-+/, '') // '(intro)' → '-intro-' → 'intro'
    .replace(/-+$/, '')
}
