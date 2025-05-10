import { pagination } from '~/src/server/common/constants/pagination.js'

function clearFilters(event) {
  event.preventDefault()

  const preserveKeys = ['page', 'size']
  const searchParams = new URLSearchParams(window.location.search)

  for (const [key] of searchParams.entries()) {
    if (!preserveKeys.includes(key)) {
      searchParams.delete(key)
    }
    if (preserveKeys.includes(key)) {
      // reset pagination to defaults
      searchParams.set(key, pagination[key])
    }
  }

  window.location.search = searchParams.toString()
}

export { clearFilters }
