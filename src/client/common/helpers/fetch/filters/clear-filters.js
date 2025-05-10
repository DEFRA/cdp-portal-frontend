import { pagination } from '~/src/server/common/constants/pagination.js'

function clearFilters(event) {
  event.preventDefault()

  window.location.search = `page=${pagination.page}&size=${pagination.size}`
}

export { clearFilters }
