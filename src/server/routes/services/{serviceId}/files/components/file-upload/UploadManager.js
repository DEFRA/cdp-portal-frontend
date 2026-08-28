export default class UploadManager extends EventTarget {
  #files

  startUpload(files) {
    this.#files = files

    setInterval(() => {
      for (const file of this.#files) {
        file.status = file.status ?? 'uploading'
        file.bytesDownloaded = file.bytesDownloaded ?? 0

        file.bytesDownloaded += 100

        if (file.bytesDownloaded >= file.size) continue

        const progress = Math.round((file.bytesDownloaded / file.size) * 100)

        this.dispatchEvent(
          new CustomEvent('progress', {
            detail: {
              name: file.name,
              size: file.size,
              bytesUploaded: file.bytesDownloaded,
              progress,
              status: file.status
            }
          })
        )
      }
    }, 10)
  }

  getFilesMeta() {
    return Array.from(this.#files).map(({ name, size }) => ({
      name,
      size
    }))
  }
}
