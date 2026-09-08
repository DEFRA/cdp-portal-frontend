import pRetry, { AbortError } from 'p-retry'

export default class UploadManager extends EventTarget {
  #files

  startUpload(service, path, files, csrfToken) {
    this.#files = files

    for (const file of this.#files) {
      this.#uploadFile(service, path, file, csrfToken)
    }
  }

  getFilesMeta() {
    return Array.from(this.#files).map(({ name, size, status }) => ({
      name,
      size,
      status
    }))
  }

  async #uploadFile(service, path, file, csrfToken) {
    try {
      file.status = 'uploading'
      file.bytesUploaded = 0
      file.progress = 0
      file.uploadParts = []

      const uploadResponse = await this.#startMultipartUpload(
        service,
        path,
        file,
        csrfToken
      )

      file.uploadId = uploadResponse.uploadId

      for (const part of uploadResponse.parts) {
        const blob = file.slice(part.byteStartPosition, part.byteEndPosition)
        file.uploadParts.push({
          partNumber: part.partNumber,
          url: part.url,
          blob
        })
      }

      await Promise.all(
        file.uploadParts.map(async (uploadPart) => {
          uploadPart.contentMd5 = await calcMd5Hash(uploadPart.blob)

          const uploadManager = this
          const progressTrackingStream = new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk)
              file.bytesUploaded += chunk.byteLength
              file.progress = Math.round((file.bytesUploaded / file.size) * 100)

              uploadManager.#dispatchFileEvent('progress', file)
            }
          })

          const uploadResponse = await this.#streamBlob(
            uploadPart.url,
            uploadPart.blob,
            uploadPart.contentMd5,
            progressTrackingStream
          )

          if (!uploadResponse.ok) {
            throw new Error('part upload failed')
          }

          uploadPart.eTag = uploadResponse.ETag
        })
      )

      await this.#completeMultipartUpload(service, path, file, csrfToken)

      file.status = 'complete'
      file.progress = 100
      this.#dispatchFileEvent('complete', file)
    } catch (error) {
      file.status = 'failed'
      this.#dispatchFileEvent('failed', file)
    }
  }

  #dispatchFileEvent(type, file) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: {
          name: file.name,
          size: file.size,
          bytesUploaded: file.bytesUploaded,
          status: file.status,
          progress: file.progress,
          uploadId: file.uploadId
        }
      })
    )
  }

  async #streamBlob(url, blob, md5Hash, progressTrackingStream) {
    const uploadResponse = await fetchWithRetry(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-MD5': md5Hash
      },
      body: blob.stream().pipeThrough(progressTrackingStream),
      duplex: 'half'
    })

    return uploadResponse
  }

  async #startMultipartUpload(service, path, file, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-api/multipart-upload`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          path: `${path}/${file.name}`,
          size: file.size
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to start multipart upload')
    }

    const { uploadId } = await response.json()

    return uploadId
  }

  async #completeMultipartUpload(service, path, file, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-api/multipart-upload/${file.uploadId}`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          path: `${path}/${file.name}`,
          uploadParts: file.uploadParts.map((part) => ({
            eTag: part.eTag,
            partNumber: part.partNumber
          }))
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to complete multipart upload')
    }

    const { uploadId } = await response.json()

    return uploadId
  }
}

function fetchWithRetry(url, fetchOpts, retryOpts = {}) {
  return pRetry(
    async () => {
      const response = await fetch(url, fetchOpts)

      if (response.status === 404) {
        throw new AbortError(`${response.status}:${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(`${response.status}:${response.statusText}`)
      }

      return response
    },
    { retries: 2, minTimeout: 500, ...retryOpts }
  )
}

async function calcMd5Hash(file) {
  return Promise.resolve('UkUAIAQuiwgu2gUewQi0PA==')
}
