import { formatText } from '#config/nunjucks/filters/filters.js'

export default {
  type: 'onPostHandler',
  method: (request, h) => {
    if (request.response.variety !== 'view') {
      return h.continue
    }
    const response = request.response
    response.source.context = response.source.context
      ? response.source.context
      : {}

    response.source.context.helpers = {
      resolveLabel(def, name) {
        return `${def.flags.label ?? name}${def.flags.presence === 'optional' ? ' (optional)' : ''}`
      },

      resolveItems(def, values) {
        return def.items?.map((item) => ({
          value: item.allow.at(0),
          text: item.flags?.label,
          checked: values?.includes(item.allow.at(0))
        }))
      },

      resolveSummaryRows(def) {
        return Object.entries(def.flags?.default ?? {}).map(([key, value]) => ({
          key: {
            text: formatText(key)
          },
          value: {
            text: value
          }
        }))
      },

      resolveValid(def, values) {
        return def.allow?.map((value) => ({
          value,
          text: formatText(value),
          checked: values?.includes(value)
        }))
      },

      resolveMeta(def, name) {
        return def.metas?.find((meta) => meta[name])?.[name]
      }
    }

    return h.continue
  },
  options: { sandbox: 'plugin' }
}
