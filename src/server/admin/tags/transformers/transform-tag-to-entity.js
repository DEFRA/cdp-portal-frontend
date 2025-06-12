import { renderServiceTag } from '~/src/server/admin/tags/helpers/service-tags.js'

/**
 *
 * @param {string|{}}tagOrName
 * @returns {{kind: string, value: string}|null}
 */
export function transformTagToEntity(tagOrName) {
  const rendered = renderServiceTag(tagOrName)
  if (rendered) {
    return {
      kind: 'html',
      value: rendered
    }
  }
  return null
}
