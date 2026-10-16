import create from './create.js'
import deleteAction from './delete.js'
import importAction from './import.js'

export default {
  create,
  delete: deleteAction,
  import: importAction
}
