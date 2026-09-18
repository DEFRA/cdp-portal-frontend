export function encodePathSegments(path = '') {
  const parts = path.split('/')
  const encoded = parts.map((part) => encodeURI(part))
  return encoded.join('/')
}
