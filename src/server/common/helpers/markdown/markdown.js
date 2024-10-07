import { marked } from 'marked'
import markedAlert from 'marked-alert'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { gdsAlertRenderer } from '~/src/server/common/helpers/markdown/gds-alert-renderer'
import { gdsTableRenderer } from '~/src/server/common/helpers/markdown/gds-table-renderer'

export const markdown = marked
  .use({
    pedantic: false,
    gfm: true
  })
  .use(gfmHeadingId({}))
  .use(markedAlert())
  .use(gdsAlertRenderer())
  .use(gdsTableRenderer())
