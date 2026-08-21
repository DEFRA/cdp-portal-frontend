import { config } from '#config/config.js'
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// TODO: Use real bucket / call BE
const bucket = config.get('documentation.bucket')

// TODO: handle pagination
export async function listPathContents(request, path) {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: path.replace('/', '')
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const name =
      path !== '/' ? obj.Key.replace(`${path.replace('/', '')}/`, '') : obj.Key

    if (!name.includes('/')) {
      acc[name] = {
        path: obj.Key,
        size: obj.Size,
        modifiedDate: obj.LastModified,
        name,
        isFolder: false
      }
    } else {
      const folder = name.split('/').at(0)

      if (acc[folder]) {
        acc[folder].size += obj.Size
        if (obj.LastModified > acc[folder].modifiedDate) {
          acc[folder].modifiedDate = obj.LastModified
        }
      } else {
        acc[folder] = {
          path: path !== '/' ? `${path}/${folder}` : `/${folder}`,
          size: obj.Size,
          modifiedDate: obj.LastModified,
          name: folder,
          isFolder: true
        }
      }
    }

    return acc
  }, {})

  return Object.values(aggregatedFolders).sort(
    (a, b) => b.isFolder - a.isFolder || a.name.localeCompare(b.name, 'en-GB')
  )
}

// TODO: handle pagination
export async function folderTreeForPath(request, path) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const folderParts = obj.Key.split('/').slice(0, -1)

    let nested = acc
    folderParts.forEach((part, index) => {
      const currentPath = `/${folderParts.slice(0, index).join('/')}`

      if (path.includes(currentPath)) {
        const folderPath =
          currentPath === '/' ? `/${part}` : `${currentPath}/${part}`

        if (!nested[part]) {
          nested[part] = {
            path: folderPath,
            subFolders: {},
            isCurrent: path === folderPath
          }
        }

        nested = nested[part].subFolders
      }
    })

    return acc
  }, {})

  return aggregatedFolders
}

export async function getFile(request, path) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path.replace('/', '')
  })

  return request.s3Client.send(command)
}

export async function getFileUrl(request, path) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path.replace('/', ''),
    ResponseContentDisposition: 'attachment'
  })

  const url = await getSignedUrl(request.s3Client, command, {
    expiresIn: 10,
    unsignableHeaders: new Set(['content-disposition'])
  })

  return url
}
