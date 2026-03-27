export default function withQueryParams(pathname, query = {}, params = {}) {
  const searchParams = new URLSearchParams([
    ...Object.entries({
      ...query,
      ...params
    })
  ]).toString()

  return `${pathname}?${searchParams}`
}
