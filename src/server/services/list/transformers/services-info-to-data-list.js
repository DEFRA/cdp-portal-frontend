function servicesInfoToDataList(servicesCount) {
  return [
    {
      heading: {
        text: 'Total'
      },
      entity: {
        kind: 'text',
        value: servicesCount
      }
    }
  ]
}

export { servicesInfoToDataList }
