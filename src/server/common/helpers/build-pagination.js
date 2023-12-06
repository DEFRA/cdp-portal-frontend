import qs from 'qs'

function buildPagination(page, pageSize, totalPages, queryParams) {
  const pagination = { items: [] }

  // add items
  for (let i = 1; i <= totalPages; i++) {
    const params = {
      ...queryParams,
      page: i,
      size: pageSize
    }

    const item = {
      number: i,
      href: '?' + qs.stringify(params)
    }

    if (i === page) {
      item.current = true
    }

    pagination.items.push(item)
  }

  // add previous
  if (pagination.items.length > 1 && page > 1) {
    const params = {
      ...queryParams,
      page: parseInt(page) - 1,
      size: pageSize
    }
    pagination.previous = {
      href: '?' + qs.stringify(params)
    }
  }

  // add next
  if (page < totalPages) {
    const params = {
      ...queryParams,
      page: parseInt(page) + 1,
      size: pageSize
    }
    pagination.next = {
      href: '?' + qs.stringify(params)
    }
  }

  return pagination
}

export { buildPagination }
