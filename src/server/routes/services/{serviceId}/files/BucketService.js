import { config } from '#config/config.js'
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  UploadPartCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const SIGNED_URL_TTL_SECONDS = 10

// TODO: Use real bucket / call BE
const bucket = config.get('documentation.bucket')

// TODO: handle pagination
export async function listPathContents(request, path) {
  const s3Path = formatAsS3Path(path, true)

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: s3Path === '/' ? undefined : s3Path
  })
  const response = await request.s3Client.send(command)

  const aggregatedFolders = (response.Contents ?? []).reduce((acc, obj) => {
    const name = s3Path === '/' ? obj.Key : obj.Key.replace(s3Path, '')

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
          path: formatAsS3Path(
            path !== '' ? `${path}/${folder}/` : `${folder}/`
          ),
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
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: formatAsS3Path(path),
    ResponseContentDisposition: 'attachment' // NOTE: does not work on local with mock AWS
  })

  const url = await getSignedUrl(request.s3Client, command, {
    expiresIn: SIGNED_URL_TTL_SECONDS,
    unsignableHeaders: new Set(['content-disposition'])
  })

  return url
}

export async function getFilePutUrl(request, path, uploadId, uploadPartNumber) {
  let command
  if (uploadId) {
    command = new UploadPartCommand({
      Bucket: bucket,
      Key: formatAsS3Path(path),
      UploadId: uploadId,
      PartNumber: uploadPartNumber
    })
  } else {
    command = new PutObjectCommand({
      Bucket: bucket,
      Key: formatAsS3Path(path)
    })
  }

  const url = await getSignedUrl(request.s3Client, command, {
    expiresIn: SIGNED_URL_TTL_SECONDS
  })
  console.log(url)
  return url
}

function formatAsS3Path(path = '', withTrailingSlash) {
  let result = path

  if (result.startsWith('/')) {
    result = result.replace('/', '')
  }

  if (withTrailingSlash && !result.endsWith('/')) {
    result = `${result}/`
  }

  return result
}

export async function startMultipartUpload(request, path) {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: formatAsS3Path(path)
  })
  const { UploadId } = await request.s3Client.send(command)

  return UploadId
}

export async function completeMultipartUpload(
  request,
  path,
  uploadId,
  uploadParts = []
) {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: formatAsS3Path(path),
    UploadId: uploadId,
    MultipartUpload: {
      Parts: uploadParts.map(({ eTag, partNumber }) => ({
        ETag: eTag,
        PartNumber: partNumber
      }))
    }
  })
  await request.s3Client.send(command)
}
