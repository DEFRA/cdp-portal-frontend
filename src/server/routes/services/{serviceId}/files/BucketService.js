import { config } from '#config/config.js'
import {
  ListObjectsV2Command
} from '@aws-sdk/client-s3'

// TODO: Use real bucket / call BE
const bucket = config.get('documentation.bucket')

// TODO: handle pagination
export async function listPathContents(request, path) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: path
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const name = obj.Key.replace(path, '')

    if (!name.includes('/')) {
      acc[name] = {
        ...obj,
        name,
        isFolder: false
      }
    }

    const folder = name.split('/').at(0)

    if (acc[folder]) {
      acc[folder].size += obj.size
      if (obj.LastModified > acc[folder].LastModified) {
        acc[folder].LastModified = obj.LastModified
      }
    } else {
      acc[folder] = {
        ...obj,
        name: folder,
        isFolder: true
      }
    }



    return acc
  }, {})

  const result = Object.values(aggregatedFolders).map((obj) => {
    return {
      path: obj.Key,
      name: obj.name,
      size: obj.Size,
      modifiedDate: obj.LastModified,
      isFolder: obj.isFolder
    }
  })

  return result
}
