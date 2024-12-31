import upperFirst from 'lodash/upperFirst.js'
import kebabCase from 'lodash/kebabCase.js'
import assign from 'lodash/assign.js'
import isArray from 'lodash/isArray.js'
import isNil from 'lodash/isNil.js'
import compact from 'lodash/compact.js'
import union from 'lodash/union.js'
import startCase from 'lodash/startCase.js'
import find from 'lodash/find.js'
import { formatDistanceToNow } from 'date-fns'

import { pluralise } from '~/src/server/common/helpers/pluralise.js'
import { formatDate } from '~/src/server/common/helpers/date/format-date.js'
import { relativeDate } from '~/src/server/common/helpers/date/relative-date.js'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user.js'

const formatText = (value) => upperFirst(kebabCase(value))

export {
  assign,
  compact,
  find,
  formatDate,
  formatDistanceToNow,
  formatText,
  isArray,
  isNil,
  pluralise,
  relativeDate,
  sanitiseUser,
  startCase,
  union
}
