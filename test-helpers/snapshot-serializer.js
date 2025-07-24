const PortalSnapshotSerializer = {
  test(val) {
    return typeof val === 'string' && val.includes('<html')
  },
  print(val) {
    return val.replace(/\/public/g, '/.public')
  }
}

export default PortalSnapshotSerializer
