import { marked } from 'marked'
import markedAlert from 'marked-alert'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { markedAlertsGDSRenderer } from '~/src/server/common/helpers/markdown/marked-alerts-gds-renderer'

export const markdown = marked
  .use({
    pedantic: false,
    gfm: true
  })
  .use(gfmHeadingId({}))
  .use(markedAlert())
  .use(markedAlertsGDSRenderer())
