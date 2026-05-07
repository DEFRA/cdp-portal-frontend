
export function headingToAnchor(text) {
  return text.toLowerCase().replace(/\W+/g, '-')
}
