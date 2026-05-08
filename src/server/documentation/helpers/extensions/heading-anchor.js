export function headingToAnchor(text) {
  return text
    .toLowerCase()
    .replaceAll(/\W+/g, '-') // 'foo: bar' → 'foo-bar'   // not 'foo--bar'
    .replace(/^-+/, '') // '(intro)' → '-intro-' → 'intro'
    .replace(/-+$/, '')
}
