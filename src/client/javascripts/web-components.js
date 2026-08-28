import Progress from '#server/common/components/progress/Progress.js'
import UploadActions from '#server/routes/services/{serviceId}/files/components/upload-actions/UploadActions.js'
import FileUpload from '#server/routes/services/{serviceId}/files/components/file-upload/FileUpload.js'

// Prevent components being removed by build treeshaking
window.wcs = [Progress, UploadActions, FileUpload]
