import pRetry, { AbortError } from 'p-retry'
import SparkMD5 from 'spark-md5'

const HASH_CHUNK_SIZE = 2 * 1024 * 1024 // Chunks of 2MB

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
          url: `/services/${service}/imports-resource/${encodedResourcePath(path, file.name)}?${part.queryParams}`,
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
            csrfToken,
            progressTrackingStream
          )

          if (!uploadResponse.ok) {
            throw new Error('part upload failed')
          }

          uploadPart.eTag = uploadResponse.headers.get('etag')
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

  async #streamBlob(url, blob, md5Hash, csrfToken, progressTrackingStream) {
    const uploadResponse = await fetchWithRetry(
      `${url}&contentMd5=${encodeURIComponent(md5Hash)}`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'no-cache, no-store, max-age=0',
          Expires: 'Thu, 1 Jan 1970 00:00:00 GMT',
          Pragma: 'no-cache',
          'X-CSRF-Token': csrfToken
        },
        body: blob.stream().pipeThrough(progressTrackingStream),
        duplex: 'half'
      }
    )

    return uploadResponse
  }

  async #startMultipartUpload(service, path, file, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-resource/${encodedResourcePath(path, file.name)}`,
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
          size: file.size
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to start multipart upload')
    }

    const result = await response.json()

    return result
  }

  async #completeMultipartUpload(service, path, file, csrfToken) {
    const response = await fetchWithRetry(
      `/services/${service}/imports-resource/${encodedResourcePath(path, file.name)}?uploadId=${file.uploadId}`,
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

function encodedResourcePath(path, filename) {
  if (!path) return encodeURIComponent(filename)

  if (path && filename) return `${path}/${encodeURIComponent(filename)}`
}

async function calcMd5Hash(blob) {
  return new Promise((resolve, reject) => {
    const md5 = new SparkMD5.ArrayBuffer()
    const numberOfChunks = Math.ceil(blob.size / HASH_CHUNK_SIZE)
    const fileReader = new FileReader()
    let currentChunk = 0

    fileReader.onerror = (error) => {
      reject(error)
    }

    fileReader.onload = (event) => {
      md5.append(event.target.result)
      currentChunk++

      if (currentChunk < numberOfChunks) {
        loadNext()
      } else {
        const hash = btoa(md5.end(true)) // Base64 encoded
        md5.destroy()
        resolve(hash)
      }
    }

    function loadNext() {
      const start = currentChunk * HASH_CHUNK_SIZE
      const end =
        start + HASH_CHUNK_SIZE >= blob.size
          ? blob.size
          : start + HASH_CHUNK_SIZE

      fileReader.readAsArrayBuffer(blob.slice(start, end))
    }

    loadNext()
  })
}
