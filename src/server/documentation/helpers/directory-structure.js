import path from 'node:path'
import { startCase } from 'lodash'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

async function directoryStructure(request, bucket) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
  })

  const response = await request.s3Client.send(command)
  const documentationRoute = '/documentation'

  return response.Contents.filter((content) => content.Key.endsWith('.md')).map(
    (content) => {
      const key = content.Key

      if (key.toLowerCase() === 'readme.md') {
        return {
          text: 'Documentation',
          anchor: path.join(documentationRoute, key),
          level: 0
        }
      }

      if (key.toLowerCase().endsWith('readme.md')) {
        const text = key.replace(/\/readme.md/i, '')

        return {
          text: startCase(text),
          anchor: path.join(documentationRoute, key),
          level: text.split('/').length
        }
      }

      const textParts = key.split('/')
      textParts.shift()

      return {
        text: startCase(textParts.join(' ').replace('.md', '')),
        anchor: path.join(documentationRoute, key),
        level: key.split('/').length
      }
    }
  )
}

export { directoryStructure }
