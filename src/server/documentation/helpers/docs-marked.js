import { marked } from 'marked'
import markedAlert from 'marked-alert'

import { link } from '~/src/server/documentation/helpers/link'

export const docsMarked = marked
  .use({ pedantic: false, gfm: true })
  .use(markedAlert(), link())
