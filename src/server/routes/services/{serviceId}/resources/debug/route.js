import * as parent from '../route.js'

export { ext, default } from '../route.js'

export const options = {
  ...parent.options,
  id: `${parent.options.id}/debug`
}
