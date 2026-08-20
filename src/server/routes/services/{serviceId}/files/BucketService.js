import { config } from '#config/config.js'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

// TODO: Use real bucket / call BE
const bucket = config.get('documentation.bucket')

// TODO: handle pagination
export async function listPathContents(request, path) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: path !== '/' ? path : undefined
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const name = path !== '' ? obj.Key.replace(`${path}/`, '') : obj.Key

    if (!name.includes('/')) {
      acc[name] = {
        path: obj.Key,
        size: obj.Size,
        modifiedDate: obj.LastModified,
        name,
        isFolder: false
      }
    }

    const folder = name.split('/').at(0)

    if (acc[folder]) {
      acc[folder].size += obj.Size
      if (obj.LastModified > acc[folder].modifiedDate) {
        acc[folder].modifiedDate = obj.LastModified
      }
    } else {
      acc[folder] = {
        path: path !== '/' ? `/${path}/${folder}` : `/${folder}`,
        size: obj.Size,
        modifiedDate: obj.LastModified,
        name: folder,
        isFolder: true
      }
    }

    return acc
  }, {})

  return Object.values(aggregatedFolders).sort(
    (a, b) => b.isFolder - a.isFolder || a.name.localeCompare(b.name, 'en-GB')
  )
}
