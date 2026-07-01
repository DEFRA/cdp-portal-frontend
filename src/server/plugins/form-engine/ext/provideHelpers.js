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
        return `${def.flags?.label ?? name}${def.flags?.presence === 'optional' ? ' (optional)' : ''}`
      },

      resolveSummaryRows(def) {
        return Object.entries(def.flags?.default ?? {}).map(([key, value]) => ({
          key: {
            text: formatText(key)
          },
          value: {
            html: renderObject(value)
          }
        }))
      },

      resolveChecked(options, values) {
        return options.map((option) => ({
          value: option.value,
          text: option.text,
          checked: values?.includes(option.value)
        }))
      },

      resolveMeta(def, name) {
        return def.metas?.find((meta) => meta[name])?.[name]
      },

      hasNestedErrors(name, formErrors = {}) {
        return Object.entries(formErrors).find(([key]) => key.includes(name))
      }
    }

    return h.continue
  },
  options: { sandbox: 'plugin' }
}

function renderObject(obj) {
  if (typeof obj === 'object') {
    return `<table class="table--embedded">${Object.entries(obj)
      .filter(([field]) => field !== 'environments')
      .map(
        ([field, value]) => `<tr>
    <th>${formatText(field).replaceAll('-', ' ')}</th>
    <td>${renderObject(value)}</td>
  </tr>`
      )
      .join('')}</table>`
  } else {
    return obj.toString()
  }
}
