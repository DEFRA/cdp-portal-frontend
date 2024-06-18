import qs from 'qs'

// TODO refactor
function buildPagination(page, pageSize, totalPages, queryParams) {
  if (
    !Number.isInteger(page) ||
    !Number.isInteger(pageSize) ||
    !Number.isInteger(totalPages) ||
    page <= 0 ||
    pageSize <= 0 ||
    totalPages <= 0
  ) {
    throw new Error('Invalid parameters')
  }

  const pagination = { items: [] }
  const isLongPagination = totalPages > 10
  const shortPaginationPages = new Set([
    1,
    page - 1,
    page,
    page + 1,
    totalPages
  ])

  // add items
  for (let i = 1; i <= totalPages; i++) {
    if (isLongPagination && !shortPaginationPages.has(i)) {
      if (i === page - 2 || i === page + 2) {
        pagination.items.push({ ellipsis: true })
      }
      continue
    }
    const params = { ...queryParams, page: i, size: pageSize }
    const item = { number: i, href: `?${qs.stringify(params)}` }
    if (i === page) {
      item.current = true
    }
    pagination.items.push(item)
  }

  // add previous
  if (pagination.items.length > 1 && page > 1) {
    const params = { ...queryParams, page: page - 1, size: pageSize }
    pagination.previous = { href: `?${qs.stringify(params)}` }
  }

  // add next
  if (page < totalPages) {
    const params = { ...queryParams, page: page + 1, size: pageSize }
    pagination.next = { href: `?${qs.stringify(params)}` }
  }

  return pagination
}

export { buildPagination }
