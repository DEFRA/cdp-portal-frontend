import { config } from '#config/config.js'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

// TODO: Use real bucket / call BE
const bucket = config.get('documentation.bucket')

const service = 'cdp-postgres-service' // 'cdp-example-node-postgres-be' // 'cdp-postgres-service'

export async function listPathContents(request, path) {
  const s3Path = formatAsS3Path(path, true)

  const endpoint = `${config.get('portalBackendUrl')}/entities/${service}/imports/${s3Path}`
  const { payload = {} } = await request.authedFetchJson(endpoint)

  return payload
}

export async function folderTreeForPath(request, path) {
  const s3Path = formatAsS3Path(path, true)

  const command = new ListObjectsV2Command({
    Bucket: bucket
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const folderParts = obj.Key.split('/').slice(0, -1)

    let nested = acc
    folderParts.forEach((part, index) => {
      const currentPath = formatAsS3Path(
        folderParts.slice(0, index).join('/'),
        true
      )

      if (s3Path.includes(currentPath)) {
        const folderPath = formatAsS3Path(
          currentPath === '/' ? part : `${currentPath}${part}`,
          true
        )

        if (!nested[part]) {
          nested[part] = {
            path: folderPath,
            subFolders: {},
            isCurrent: s3Path === folderPath
          }
        }

        nested = nested[part].subFolders
      }
    })

    return acc
  }, {})

  return aggregatedFolders
}

export async function getFileUrl(request, path) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}/entities/${service}/imports/${encodeURIComponent(s3Path)}`

  const { payload = {} } = await request.authedFetchJson(endpoint)

  return payload.url
}

export async function startMultipartUpload(request, path, size) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}/entities/${service}/imports/${encodeURIComponent(s3Path)}`

  try {
    const { payload = {} } = await request.authedFetchJson(endpoint, {
      method: 'POST',
      payload: {
        size
      }
    })

    return payload
  } catch (error) {
    request.logger.error(error)
    throw error
  }
}

export async function getMultipartUploadPartUrl(
  request,
  path,
  uploadId,
  partNumber,
  contentMd5
) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}/entities/${service}/imports/${encodeURIComponent(s3Path)}?uploadId=${uploadId}&partNumber=${partNumber}&contentMd5=${contentMd5}`
  const { payload = {} } = await request.authedFetchJson(endpoint, {
    method: 'PUT'
  })

  return payload.url
}

export async function completeMultipartUpload(
  request,
  path,
  uploadId,
  uploadParts = []
) {
  const s3Path = formatAsS3Path(path)

  const endpoint = `${config.get('portalBackendUrl')}/entities/${service}/imports/${encodeURIComponent(s3Path)}`
  await request.authedFetchJson(endpoint, {
    method: 'PUT',
    payload: {
      uploadId,
      parts: uploadParts
    }
  })

  // const command = new CompleteMultipartUploadCommand({
  //   Bucket: bucket,
  //   Key: formatAsS3Path(path),
  //   UploadId: uploadId,
  //   MultipartUpload: {
  //     Parts: uploadParts.map(({ eTag, partNumber }) => ({
  //       ETag: eTag,
  //       PartNumber: partNumber
  //     }))
  //   }
  // })
  // await request.s3Client.send(command)
}

function formatAsS3Path(path = '', withTrailingSlash) {
  let result = path

  if (path === '') return path

  if (result.startsWith('/')) {
    result = result.replace('/', '')
  }

  if (withTrailingSlash && !result.endsWith('/')) {
    result = `${result}/`
  }

  return result
}
