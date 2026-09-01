export default class UploadManager extends EventTarget {
  #files

  startUpload(service, path, files, csrfToken) {
    this.#files = files

    for (const file of this.#files) {
      this.#uploadFile(service, path, file, csrfToken)
    }

    // // TODO: Replace with actual upload
    // setInterval(() => {
    //   for (const file of this.#files) {
    //     file.status = file.status ?? 'uploading'
    //     file.bytesDownloaded = file.bytesDownloaded ?? 0

    //     file.bytesDownloaded += 100

    //     if (file.bytesDownloaded >= file.size) {
    //       if (file.status !== 'complete') {
    //         file.status = 'complete'

    //         this.dispatchEvent(
    //           new CustomEvent('complete', {
    //             detail: {
    //               name: file.name,
    //               size: file.size,
    //               bytesUploaded: file.size,
    //               progress: 100,
    //               status: file.status
    //             }
    //           })
    //         )
    //       }

    //       continue
    //     }

    //     const progress = Math.round((file.bytesDownloaded / file.size) * 100)

    //     this.dispatchEvent(
    //       new CustomEvent('progress', {
    //         detail: {
    //           name: file.name,
    //           size: file.size,
    //           bytesUploaded: file.bytesDownloaded,
    //           progress,
    //           status: file.status
    //         }
    //       })
    //     )
    //   }
    // }, 10)
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

      const urlRequest = await fetch(`/services/${service}/files-api/put-url`, {
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
          path: `${path}/${file.name}`
        })
      })

      if (!urlRequest.ok) {
        throw new Error('Url fetch failed')
      }

      const { url } = await urlRequest.json()

      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: file //.stream(), // .pipeThrough(progressTrackingStream),
        // duplex: 'half'
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      this.dispatchEvent(
        new CustomEvent('complete', {
          detail: {
            name: file.name,
            size: file.size,
            bytesUploaded: file.size,
            status: 'complete',
            progress: 100
          }
        })
      )

    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('failed', {
          detail: {
            name: file.name,
            size: file.size,
            bytesUploaded: file.size,
            status: 'failed'
          }
        })
      )
    }
  }

  async #uploadLargeFile(service, path, file, csrfToken) {
    // TODO: over a certain size, split the upload into parallel streams
  }
}
