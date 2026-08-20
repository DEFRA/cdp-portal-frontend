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

  return (response.Contents ?? []).map((obj) => {
    const name = obj.Key.replace(path, '')

    return {
      path: obj.Key,
      name,
      size: obj.Size,
      modifiedDate: obj.LastModified.toUTCString()
    }
  })
}
